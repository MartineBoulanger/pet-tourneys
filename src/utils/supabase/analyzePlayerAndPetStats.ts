import { getPetsByNames } from '@/actions/supabase/pets-schema/pets/getPets';
import {
  BattleLog,
  EnhancedPlayerRecord,
  Match,
  OpponentPetStats,
  PetStats,
} from '@/types/supabase.types';

// =================================================
// Helper function for the matches actions
// - analyzing the player and pet stats
// =================================================
export async function analyzePlayerAndPetStats(
  matches: Match[],
  battleLogs: BattleLog[],
): Promise<EnhancedPlayerRecord[]> {
  // Track match results with region-specific keys
  const matchResults = new Map<
    string,
    { wins: number; losses: number; region: string }
  >();

  const battlePetStats = new Map<
    string,
    Map<string, { timesUsed: number; kills: number; deaths: number }>
  >();

  const problematicPets = new Map<string, Map<string, number>>();

  const playerMatches = new Map<
    string,
    {
      id: string;
      opponent: string;
      owner_score: number;
      opponent_score: number;
      date: string;
    }[]
  >();

  const playerForfeitStatus = new Map<string, boolean>();

  // Initialize all players from matches with region-specific keys
  matches.forEach((match) => {
    const matchRegion = match.region || 'N/A';

    [match.player1, match.player2].forEach((player) => {
      const playerKey = `${player}-${matchRegion}`;

      if (!matchResults.has(playerKey)) {
        matchResults.set(playerKey, {
          wins: 0,
          losses: 0,
          region: matchRegion,
        });
      }
      if (!battlePetStats.has(playerKey)) {
        battlePetStats.set(playerKey, new Map());
      }
      if (!problematicPets.has(playerKey)) {
        problematicPets.set(playerKey, new Map());
      }
    });
  });

  // Set matches list per player with region-specific keys with forfeit matches filtered out
  const matchesList = matches.filter((m) => m.outcome !== 'FORFEIT');
  matchesList.forEach((match) => {
    const matchRegion = match.region || 'N/A';

    [match.player1, match.player2].forEach((player) => {
      const playerKey = `${player}-${matchRegion}`;

      if (!playerMatches.has(playerKey)) {
        playerMatches.set(playerKey, []);
      }

      const opponent = player === match.player1 ? match.player2 : match.player1;
      playerMatches.get(playerKey)!.push({
        id: match.id,
        opponent,
        owner_score: match.owner_score ?? 0,
        opponent_score: match.opponent_score ?? 0,
        date: match.date,
      });
    });
  });

  // Determine forfeit status per player with region-specific keys
  matches.forEach((match) => {
    const matchRegion = match.region || 'N/A';
    const isForfeit = match.outcome === 'FORFEIT';

    [match.player1, match.player2].forEach((player) => {
      const playerKey = `${player}-${matchRegion}`;

      if (!playerForfeitStatus.has(playerKey)) {
        playerForfeitStatus.set(playerKey, true); // assume only forfeits until proven otherwise
      }

      if (!isForfeit) {
        playerForfeitStatus.set(playerKey, false); // they played at least one real match
      }
    });
  });

  // Process MATCH results (win/loss) with region context
  matches.forEach((match) => {
    if (match.owner_score === match.opponent_score) return; // Skip ties
    const ownerScore = match.owner_score ?? 0;
    const opponentScore = match.opponent_score ?? 0;

    const matchRegion = match.region || 'N/A';
    const winner =
      ownerScore > opponentScore
        ? match.owner
        : match.owner === match.player1
          ? match.player2
          : match.player1;
    const loser = winner === match.player1 ? match.player2 : match.player1;

    const winnerKey = `${winner}-${matchRegion}`;
    const loserKey = `${loser}-${matchRegion}`;

    matchResults.get(winnerKey)!.wins += 1;
    matchResults.get(loserKey)!.losses += 1;
  });

  // Process BATTLE LOGS (pet statistics) with region context
  battleLogs.forEach((log) => {
    if (log.result === 'DRAW') return;

    const match = matches.find((m) => m.id === log.match_id);
    if (!match) return;

    const matchRegion = match.region || 'N/A';
    const battleWinner =
      log.result === 'WIN'
        ? match.owner
        : match.owner === match.player1
          ? match.player2
          : match.player1;
    const battleLoser =
      battleWinner === match.player1 ? match.player2 : match.player1;

    const winnerKey = `${battleWinner}-${matchRegion}`;
    const loserKey = `${battleLoser}-${matchRegion}`;

    // Process winning team's pets (kills)
    const winningPets =
      log.result === 'WIN' ? log.player_team : log.opponent_team;

    winningPets.forEach((petName) => {
      const stats = battlePetStats.get(winnerKey)!;
      if (!stats.has(petName)) {
        stats.set(petName, { timesUsed: 0, kills: 0, deaths: 0 });
      }
      const pet = stats.get(petName)!;
      pet.timesUsed += 1;
      pet.kills += 1;
    });

    // Process losing team's pets (deaths)
    const losingPets =
      log.result === 'WIN' ? log.opponent_team : log.player_team;

    losingPets.forEach((petName) => {
      const stats = battlePetStats.get(loserKey)!;
      if (!stats.has(petName)) {
        stats.set(petName, { timesUsed: 0, kills: 0, deaths: 0 });
      }
      const pet = stats.get(petName)!;
      pet.timesUsed += 1;
      pet.deaths += 1;
    });

    // Track problematic pets
    winningPets.forEach((petName) => {
      const loserStats = problematicPets.get(loserKey)!;
      loserStats.set(petName, (loserStats.get(petName) || 0) + 1);
    });
  });

  // Collect all unique pet names across all players
  const allPetNames = new Set<string>();

  const records = Array.from(matchResults.entries()).map(
    ([playerKey, { wins, losses, region }]) => {
      const [playerName] = playerKey.split('-'); // Extract just the player name
      const totalMatches = wins + losses;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      const petStats = battlePetStats.get(playerKey) || new Map();
      const problemPets = problematicPets.get(playerKey) || new Map();

      const petStatsArray: PetStats[] = Array.from(petStats.entries())
        .map(([petName, { timesUsed, kills, deaths }]) => ({
          petName,
          timesUsed,
          kills,
          deaths,
        }))
        .sort((a, b) => b.timesUsed - a.timesUsed || b.kills - a.kills);

      const problemPetsArray: OpponentPetStats[] = Array.from(
        problemPets.entries(),
      )
        .map(([petName, count]) => ({ petName, timesLostAgainst: count }))
        .sort((a, b) => b.timesLostAgainst - a.timesLostAgainst);

      petStatsArray.forEach((pet) => allPetNames.add(pet.petName));
      if (petStatsArray[0]) allPetNames.add(petStatsArray[0].petName);
      if (problemPetsArray[0]) allPetNames.add(problemPetsArray[0].petName);

      return {
        playerName,
        wins,
        losses,
        region,
        winRate: parseFloat(winRate.toFixed()),
        mostUsedPet: petStatsArray[0] || {
          petName: 'None',
          timesUsed: 0,
          kills: 0,
          deaths: 0,
        },
        mostProblematicPet: problemPetsArray[0] || {
          petName: 'None',
          timesLostAgainst: 0,
        },
        petStatistics: petStatsArray,
        matches: playerMatches.get(playerKey) || [],
        forfeitOnly: playerForfeitStatus.get(playerKey) ?? false,
        compositeId: playerKey,
      };
    },
  );

  // Fetch only the pets that are actually used
  const { data: petData } = await getPetsByNames(Array.from(allPetNames));

  // Attach relevant pets to each record
  return records.map((record) => ({
    ...record,
    pets:
      petData?.filter(
        (pet) =>
          record.petStatistics.some((ps) => ps.petName === pet.name) ||
          pet.name === record.mostUsedPet.petName ||
          pet.name === record.mostProblematicPet.petName,
      ) ?? [],
  }));
}
