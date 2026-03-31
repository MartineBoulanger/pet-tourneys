'use server';

import { apiTable } from '@/actions/supabase/actions';
import { BattleLogsStats } from '@/types/supabase.types';
import { analyzeUsedAbilities } from '@/utils/supabase/analyzeUsedAbilities';
import { calculateAverageDuration } from '@/utils/supabase/calculateAverageDuration';
import { getMostUsedPets } from '@/utils/supabase/getMostUsedPets';
import { parseBattleStatistics } from '@/utils/supabase/parseBattleStats';

export async function getLeagueBattleStats(
  id: string,
): Promise<BattleLogsStats> {
  const m = await apiTable('matches', id);
  const bl = await apiTable('battle_logs', id);

  const { data: matches, error: matchesError } = await m
    .select('id, region, owner_score, opponent_score')
    .eq('is_forfeit', false);

  if (matchesError) throw matchesError;

  const matchResultsMap = new Map<string, number>();

  matches?.forEach((match) => {
    let ownerScore = match.owner_score ?? 0;
    let opponentScore = match.opponent_score ?? 0;

    if (ownerScore < opponentScore) {
      [ownerScore, opponentScore] = [opponentScore, ownerScore];
    }

    const scoreKey = `${ownerScore}:${opponentScore}`;
    matchResultsMap.set(scoreKey, (matchResultsMap.get(scoreKey) || 0) + 1);
  });

  const matchResults = Array.from(matchResultsMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.name.localeCompare(b.name);
    });

  const matchesByRegion = [
    {
      name: 'EU',
      value: matches?.filter((m) => m.region === 'EU').length || 0,
    },
    {
      name: 'NA',
      value: matches?.filter((m) => m.region === 'NA').length || 0,
    },
    {
      name: 'OCE',
      value: matches?.filter((m) => m.region === 'OCE').length || 0,
    },
    {
      name: 'CN',
      value: matches?.filter((m) => m.region === 'CN').length || 0,
    },
    {
      name: 'Finals',
      value:
        matches?.filter((m) => !['EU', 'NA', 'OCE', 'CN'].includes(m.region))
          .length || 0,
    },
  ];

  const { data: battleLogs, error } = await bl.select('*');

  if (error) throw error;

  if (!battleLogs || battleLogs.length === 0) {
    return {
      generalStats: {
        averageDuration: '',
        totalBattles: 0,
        totalMatches: 0,
        matchesByRegion: [],
        battleResults: [],
        matchResults: [],
      },
      petStats: [],
      abilityStats: {} as ReturnType<typeof analyzeUsedAbilities>,
      battleStats: {
        totalPetSwaps: {},
        petSwapDetails: {},
        weatherChanges: { total: 0, byType: {} },
        totalWeatherChanges: 0,
        totalDeaths: 0,
        totalKills: 0,
        petPerformance: {},
      },
    };
  }

  const battleResults = [
    {
      name: 'WINS',
      value: battleLogs.filter((b) => b.result === 'WIN').length || 0,
    },
    {
      name: 'LOSSES',
      value: battleLogs.filter((b) => b.result === 'LOSS').length || 0,
    },
    {
      name: 'DRAWS',
      value: battleLogs.filter((b) => b.result === 'DRAW').length || 0,
    },
  ];

  return {
    generalStats: {
      averageDuration: calculateAverageDuration(battleLogs),
      totalBattles: battleLogs.length,
      totalMatches: matches?.length ?? 0,
      matchesByRegion,
      battleResults,
      matchResults,
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}
