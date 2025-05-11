'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import {
  parseBattleStatistics,
  calculateAverageDuration,
  getMostUsedPets,
  analyzeUsedAbilities,
} from '@/utils/analyzeToolHelpers';
import { AbilityAnalysisResult, BattleStatistics } from '@/types';

export async function getTournamentBattleStats(tournamentId: string): Promise<{
  generalStats: {
    averageDuration: string;
    totalBattles: number;
    totalMatches: number;
    matchesByRegion: {
      EU: number;
      NA: number;
      other: number;
    };
  };
  petStats: Array<{
    name: string;
    count: number;
    playerCount: number;
    opponentCount: number;
    team: 'player' | 'opponent' | 'both';
  }>;
  abilityStats: AbilityAnalysisResult;
  battleStats: BattleStatistics;
}> {
  const supabase = await createClient();
  const matchesTable = getTournamentTableName('matches', tournamentId);
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  const { data: matches, error: matchesError } = await supabase
    .schema('api')
    .from(matchesTable)
    .select('id, region');

  if (matchesError) throw matchesError;

  const matchesByRegion = {
    EU: matches?.filter((m) => m.region === 'EU').length || 0,
    NA: matches?.filter((m) => m.region === 'NA').length || 0,
    other: matches?.filter((m) => !['EU', 'NA'].includes(m.region)).length || 0,
  };

  const { data: battleLogs, error } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*');

  if (error) throw error;
  if (!battleLogs || battleLogs.length === 0) {
    return {
      generalStats: {
        averageDuration: 'N/A',
        totalBattles: 0,
        totalMatches: 0,
        matchesByRegion: {
          EU: 0,
          NA: 0,
          other: 0,
        },
      },
      petStats: [],
      abilityStats: {} as ReturnType<typeof analyzeUsedAbilities>,
      battleStats: {
        totalPetSwaps: { player: 0, opponent: 0 },
        petSwapDetails: {},
        weatherChanges: { total: 0, byType: {} },
        totalWeatherChanges: 0,
        totalDeaths: 0,
        totalKills: 0,
        petPerformance: {},
      },
    };
  }

  return {
    generalStats: {
      averageDuration: calculateAverageDuration(battleLogs),
      totalBattles: battleLogs.length,
      totalMatches: matches?.length,
      matchesByRegion,
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}

export async function getMatchBattleStats(
  tournamentId: string,
  matchId: string
): Promise<{
  generalStats: {
    averageDuration: string;
    totalBattles: number;
  };
  petStats: ReturnType<typeof getMostUsedPets>;
  abilityStats: ReturnType<typeof analyzeUsedAbilities>;
  battleStats: BattleStatistics;
}> {
  const supabase = await createClient();
  const battleLogsTable = getTournamentTableName('battle_logs', tournamentId);

  const { data: battleLogs, error } = await supabase
    .schema('api')
    .from(battleLogsTable)
    .select('*')
    .eq('match_id', matchId);

  if (error) throw error;
  if (!battleLogs || battleLogs.length === 0) {
    return {
      generalStats: {
        averageDuration: 'N/A',
        totalBattles: 0,
      },
      petStats: [],
      abilityStats: {} as ReturnType<typeof analyzeUsedAbilities>,
      battleStats: {
        totalPetSwaps: { player: 0, opponent: 0 },
        petSwapDetails: {},
        weatherChanges: { total: 0, byType: {} },
        totalWeatherChanges: 0,
        totalDeaths: 0,
        totalKills: 0,
        petPerformance: {},
      },
    };
  }

  return {
    generalStats: {
      averageDuration: calculateAverageDuration(battleLogs),
      totalBattles: battleLogs.length,
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}
