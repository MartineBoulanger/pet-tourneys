'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import { Match } from '@/components/tournaments/types';
import { BattleLog } from '@/utils/types';

export interface PlayerRecord {
  playerName: string;
  wins: number;
  losses: number;
  winRate: number;
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

  // Fetch matches from Supabase
  const { data: matches, error } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('*');

  // Fetch battle logs from Supabase
  const { data: logs, error: logsError } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*');

  if (error || logsError) {
    console.error('Error fetching data:', error || logsError);
    return [];
  }

  // Calculate player records
  return analyzePlayerAndPetStats(matches as Match[], logs as BattleLog[]);
}

export async function analyzePlayerAndPetStats(
  matches: Match[],
  battleLogs: BattleLog[]
): Promise<EnhancedPlayerRecord[]> {
  // Track match results separately from battle results
  const matchResults = new Map<string, { wins: number; losses: number }>();
  const battlePetStats = new Map<
    string,
    Map<string, { timesUsed: number; kills: number; deaths: number }>
  >();
  const problematicPets = new Map<string, Map<string, number>>();

  // Initialize all players from matches
  matches.forEach((match) => {
    [match.player1, match.player2].forEach((player) => {
      if (!matchResults.has(player)) {
        matchResults.set(player, { wins: 0, losses: 0 });
      }
      if (!battlePetStats.has(player)) {
        battlePetStats.set(player, new Map());
      }
      if (!problematicPets.has(player)) {
        problematicPets.set(player, new Map());
      }
    });
  });

  // Process MATCH results (win/loss)
  matches.forEach((match) => {
    if (match.owner_score === match.opponent_score) return; // Skip ties

    const winner =
      match.owner_score > match.opponent_score
        ? match.owner
        : match.owner === match.player1
        ? match.player2
        : match.player1;
    const loser = winner === match.player1 ? match.player2 : match.player1;

    matchResults.get(winner)!.wins += 1;
    matchResults.get(loser)!.losses += 1;
  });

  // Process BATTLE LOGS (pet statistics)
  battleLogs.forEach((log) => {
    if (log.result === 'DRAW') return;

    const match = matches.find((m) => m.id === log.match_id);
    if (!match) return;

    const battleWinner =
      log.result === 'WIN'
        ? match.owner
        : match.owner === match.player1
        ? match.player2
        : match.player1;
    const battleLoser =
      battleWinner === match.player1 ? match.player2 : match.player1;

    // Process winning team's pets (kills)
    const winningPets =
      log.result === 'WIN' ? log.player_team : log.opponent_team;
    winningPets.forEach((petName) => {
      const player = battleWinner;
      const stats = battlePetStats.get(player)!;

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
      const player = battleLoser;
      const stats = battlePetStats.get(player)!;

      if (!stats.has(petName)) {
        stats.set(petName, { timesUsed: 0, kills: 0, deaths: 0 });
      }
      const pet = stats.get(petName)!;
      pet.timesUsed += 1;
      pet.deaths += 1;
    });

    // Track problematic pets
    winningPets.forEach((petName) => {
      const loserStats = problematicPets.get(battleLoser)!;
      loserStats.set(petName, (loserStats.get(petName) || 0) + 1);
    });
  });

  // Combine results
  return Array.from(matchResults.entries()).map(
    ([playerName, { wins, losses }]) => {
      const totalMatches = wins + losses;
      const winRate = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

      const petStats = battlePetStats.get(playerName) || new Map();
      const problemPets = problematicPets.get(playerName) || new Map();

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
        winRate: parseFloat(winRate.toFixed(2)),
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
      };
    }
  );
}

// Helper function to process team pets
function processTeamPets(
  team: string[],
  player: string,
  isWinner: boolean,
  playerPetStats: Map<
    string,
    Map<string, { timesUsed: number; kills: number; deaths: number }>
  >
) {
  const playerStats = playerPetStats.get(player)!;

  team.forEach((petName) => {
    if (!playerStats.has(petName)) {
      playerStats.set(petName, { timesUsed: 0, kills: 0, deaths: 0 });
    }
    const petStat = playerStats.get(petName)!;
    petStat.timesUsed += 1;

    if (isWinner) {
      petStat.kills += 1; // Count kill for each pet on win
    } else {
      petStat.deaths += 1; // Count death for each pet on loss
    }
  });
}

// Helper function to update problematic pets
function updateProblematicPets(
  loser: string,
  winningPets: string[],
  playerProblemPets: Map<string, Map<string, number>>
) {
  const loserProblemPets = playerProblemPets.get(loser)!;

  winningPets.forEach((petName) => {
    loserProblemPets.set(petName, (loserProblemPets.get(petName) || 0) + 1);
  });
}

export async function calculatePlayerRecords(
  matches: Match[]
): Promise<PlayerRecord[]> {
  const playerStats: Record<string, { wins: number; losses: number }> = {};

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

    // Initialize players if not already tracked
    if (!playerStats[winner]) playerStats[winner] = { wins: 0, losses: 0 };
    if (!playerStats[loser]) playerStats[loser] = { wins: 0, losses: 0 };

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
        winRate: parseFloat(winRate.toFixed(2)),
      };
    }
  );

  // Sort by most wins first
  return records.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}
