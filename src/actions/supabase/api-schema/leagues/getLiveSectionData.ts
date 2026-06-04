'use server';

import { sbServer } from '@/lib/supabase/server';
import {
  SCHEMA,
  LiveSectionData,
  PlayerStanding,
  TopPet,
  PetUsageRow,
} from '@/types/supabase.types';
import { apiTable, petsTable } from '@/actions/supabase/actions';
import { getUsedPetsPerLeagueForExport } from '@/actions/supabase/api-schema/statistics/getUsedPetsPerLeague';

// =================================================
// Get data for the live section on the homepage
// =================================================
export async function getLiveSectionData(): Promise<{
  success: boolean;
  data?: LiveSectionData;
  error?: string;
}> {
  try {
    const supabase = await sbServer();

    // 1. Find the active tournament (end_date in the future or the sentinel 1999 date)
    const { data: tournament, error: tErr } = await supabase
      .schema(SCHEMA.API)
      .from('tournaments')
      .select('id, name, start_date, end_date')
      .order('start_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tErr) throw new Error(tErr.message);
    if (!tournament) {
      return { success: false, error: 'No active tournament found.' };
    }

    if (tournament.end_date !== null) {
      return { success: false, error: 'No ongoing tournament found.' };
    }

    const tid = tournament.id as string;
    const matchesTable = await apiTable('matches', tid);
    const petUsageTable = await apiTable('pet_usage', tid);

    // 2. Fetch all matches (only the columns we need)
    const { data: matches, error: mErr } = await matchesTable.select(
      'owner, outcome, region, is_forfeit, player1, player2',
    );

    if (mErr) throw new Error(mErr.message);

    // 3. Build standings per region
    const playerMap: Record<
      string,
      Record<string, { wins: number; losses: number; draws: number }>
    > = {};

    for (const m of matches ?? []) {
      const region: string = m.region ?? 'Unknown';
      const owner: string = m.owner ?? '';
      const opponent: string = owner === m.player1 ? m.player2 : m.player1;

      if (!playerMap[region]) playerMap[region] = {};

      if (!playerMap[region][owner])
        playerMap[region][owner] = { wins: 0, losses: 0, draws: 0 };

      if (!playerMap[region][opponent])
        playerMap[region][opponent] = { wins: 0, losses: 0, draws: 0 };

      const outcome = m.is_forfeit ? 'FORFEIT' : (m.outcome ?? '');

      if (outcome === 'WIN') {
        playerMap[region][owner].wins++;
        playerMap[region][opponent].losses++;
      } else if (outcome === 'LOSS') {
        playerMap[region][owner].losses++;
        playerMap[region][opponent].wins++;
      } else if (outcome === 'DRAW') {
        playerMap[region][owner].draws++;
        playerMap[region][opponent].draws++;
      } else if (outcome === 'FORFEIT') {
        playerMap[region][owner].wins++;
        playerMap[region][opponent].losses++;
      }
    }

    const standingsByRegion: Record<string, PlayerStanding[]> = {};
    const regions = Object.keys(playerMap);

    for (const region of regions) {
      const players = Object.entries(playerMap[region]).map(
        ([player, stats]) => ({
          player,
          ...stats,
          // Standard 1-0.5-0 points -- like on Challonge -- can be edited if it would change
          points: stats.wins * 1 + stats.draws * 0.5,
        }),
      );

      players.sort(
        (a, b) =>
          b.points - a.points ||
          b.wins - a.wins ||
          a.losses - b.losses ||
          a.player.localeCompare(b.player),
      );

      standingsByRegion[region] = players.slice(0, 4);
    }

    const { data: petUsageRows, error: puErr } = await petUsageTable.select(
      'pet_data, total_played, week, affix',
    );

    if (puErr) throw new Error(puErr.message);

    const petUsage = (petUsageRows ?? []) as PetUsageRow[];

    const petNames = [
      ...new Set(
        petUsage.map((r) => r.pet_data?.name).filter((n): n is string => !!n),
      ),
    ];

    const imageMap: Record<string, string | null> = {};

    if (petNames.length > 0) {
      const pets = await petsTable();
      const { data: petRows, error: petErr } = await pets
        .select('name, image')
        .in('name', petNames);

      if (petErr) throw new Error(petErr.message);

      for (const row of petRows ?? []) {
        if (row.name) {
          const image = row.image;
          const secureUrl =
            image &&
            typeof image === 'object' &&
            !Array.isArray(image) &&
            'secure_url' in image &&
            typeof image.secure_url === 'string'
              ? image.secure_url
              : null;
          imageMap[row.name] = secureUrl;
        }
      }
    }

    // Overall top pet — reuse existing aggregation
    const { data: exportPets, error: exportErr } =
      await getUsedPetsPerLeagueForExport(tid);
    if (exportErr) throw new Error(exportErr);

    const topPetOverall = exportPets?.length
      ? (() => {
          const sorted = [...exportPets].sort(
            (a, b) => b.totalPlayed - a.totalPlayed,
          );
          return {
            name: sorted[0].name,
            image: imageMap[sorted[0].name] ?? null,
            total_played: sorted[0].totalPlayed,
          };
        })()
      : null;

    // Top pet per affix — for each affix string, find the row with the highest
    // total_played whose `affixes` array contains that affix
    const allAffixes = [
      ...new Set(petUsage.map((r) => r.affix).filter((a): a is string => !!a)),
    ].sort();

    const topPetByAffix: Record<string, TopPet> = {};
    for (const affix of allAffixes) {
      const petTotals: Record<string, { name: string; total: number }> = {};
      for (const r of petUsage.filter((r) => r.affix === affix)) {
        const name = r.pet_data?.name ?? 'Unknown';
        if (!petTotals[name]) petTotals[name] = { name, total: 0 };
        petTotals[name].total += r.total_played;
      }
      const best = Object.values(petTotals).sort(
        (a, b) => b.total - a.total,
      )[0];
      if (best) {
        topPetByAffix[affix] = {
          name: best.name,
          image: imageMap[best.name] ?? null,
          total_played: best.total,
        };
      }
    }

    // Top pet per week — same pattern using the `weeks` array
    const allWeeks = [
      ...new Set(
        petUsage.map((r) => r.week).filter((w): w is number => w != null),
      ),
    ].sort((a, b) => a - b);

    const topPetByWeek: Record<number, TopPet> = {};
    for (const week of allWeeks) {
      const petTotals: Record<string, { name: string; total: number }> = {};
      for (const r of petUsage.filter((r) => r.week === week)) {
        const name = r.pet_data?.name ?? 'Unknown';
        if (!petTotals[name]) petTotals[name] = { name, total: 0 };
        petTotals[name].total += r.total_played;
      }
      const best = Object.values(petTotals).sort(
        (a, b) => b.total - a.total,
      )[0];
      if (best) {
        topPetByWeek[week] = {
          name: best.name,
          image: imageMap[best.name] ?? null,
          total_played: best.total,
        };
      }
    }

    const availableAffixes = allAffixes;
    const availableWeeks = allWeeks;

    return {
      success: true,
      data: {
        tournamentId: tid,
        tournamentName: tournament.name,
        standingsByRegion,
        regions,
        topPetOverall,
        topPetByAffix,
        topPetByWeek,
        availableAffixes,
        availableWeeks,
      },
    };
  } catch (err) {
    console.error('[getLiveSectionData]', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
