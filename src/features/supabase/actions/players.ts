'use server';

import { createClient } from '../server';
import { getTournamentTableName } from '../utils/getTournamentTableName';
import { Match } from '../components/tournaments/MatchList';
import { BattleLog } from '../types';

export interface PlayerRecord {
  playerName: string;
  wins: number;
  losses: number;
  winRate: number;
  region: string;
}

export interface PetStats {
  petName: string;
  timesUsed: number;
  kills: number;
  deaths: number;
}

export interface OpponentPetStats {
  petName: string;
  timesLostAgainst: number;
}

export interface EnhancedPlayerRecord extends PlayerRecord {
  mostUsedPet: PetStats;
  mostProblematicPet: OpponentPetStats;
  petStatistics: PetStats[];
}

export async function getPlayerRecords(tournamentId: string) {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  const { data: matches, error } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*');

  const { data: logs, error: logsError } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*');

  if (error || logsError) {
    console.error('Error fetching data:', error || logsError);
    return { records: [], regions: [] };
  }

  const regions = getAvailableRegions(matches as Match[]);
  const records = await analyzePlayerAndPetStats(
    matches as Match[],
    logs as BattleLog[]
  );

  return { records, regions };
}

// Helper function to get available regions
function getAvailableRegions(matches: Match[]): string[] {
  const regions = new Set<string>();
  matches.forEach((match) => {
    if (match.region) regions.add(match.region);
  });
  return Array.from(regions).sort();
}

export async function analyzePlayerAndPetStats(
  matches: Match[],
  battleLogs: BattleLog[]
): Promise<EnhancedPlayerRecord[]> {
  // Track match results with region-specific keys
  const matchResults = new Map<
    string, // playerName-region composite key
    { wins: number; losses: number; region: string }
  >();

  const battlePetStats = new Map<
    string, // playerName-region composite key
    Map<string, { timesUsed: number; kills: number; deaths: number }>
  >();

  const problematicPets = new Map<
    string, // playerName-region composite key
    Map<string, number>
  >();

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

  // Process MATCH results (win/loss) with region context
  matches.forEach((match) => {
    if (match.owner_score === match.opponent_score) return; // Skip ties

    const matchRegion = match.region || 'N/A';
    const winner =
      match.owner_score > match.opponent_score
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

  // Combine results into EnhancedPlayerRecord format
  return Array.from(matchResults.entries()).map(
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
        problemPets.entries()
      )
        .map(([petName, count]) => ({ petName, timesLostAgainst: count }))
        .sort((a, b) => b.timesLostAgainst - a.timesLostAgainst);

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
        // Add composite ID for reference
        compositeId: playerKey,
      };
    }
  );
}

export async function calculatePlayerRecords(
  matches: Match[]
): Promise<PlayerRecord[]> {
  const playerStats: Record<
    string,
    { wins: number; losses: number; region: string }
  > = {};

  // Process each match
  matches.forEach((match) => {
    // Determine the winner and loser
    const winner =
      match.owner_score > match.opponent_score
        ? match.owner
        : match.owner_score < match.opponent_score
        ? match.owner === match.player1
          ? match.player2
          : match.player1
        : null; // tie

    // Skip ties
    if (winner === null) return;

    const loser = winner === match.player1 ? match.player2 : match.player1;
    const region = match.region || 'N/A';

    // Initialize players if not already tracked
    if (!playerStats[winner])
      playerStats[winner] = { wins: 0, losses: 0, region };
    if (!playerStats[loser])
      playerStats[loser] = { wins: 0, losses: 0, region };

    // Update stats
    playerStats[winner].wins += 1;
    playerStats[loser].losses += 1;
  });

  // Convert to array format and calculate win rates
  const records: PlayerRecord[] = Object.entries(playerStats).map(
    ([playerName, stats]) => {
      const totalGames = stats.wins + stats.losses;
      const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;

      return {
        playerName,
        wins: stats.wins,
        losses: stats.losses,
        region: stats.region,
        winRate: parseFloat(winRate.toFixed(2)),
      };
    }
  );

  // Sort by most wins first
  return records.sort((a, b) => b.wins - a.wins);
}
