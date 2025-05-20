'use server';

import { createClient } from '@/supabase/server';
import { getTournamentTableName } from '@/utils/getTournamentTableName';
import {
  parseBattleStatistics,
  calculateAverageDuration,
  getMostUsedPets,
  analyzeUsedAbilities,
} from '@/utils/analyzeToolHelpers';
import { AbilityAnalysisResult, BattleStatistics } from '@/utils/types';

export async function getTournamentBattleStats(tournamentId: string): Promise<{
  generalStats: {
    averageDuration: string;
    totalBattles: number;
    totalMatches: number;
    matchesByRegion: {
      region: string;
      value: number;
    }[];
    battleResults: {
      result: string;
      value: number;
    }[];
  }; // TODO: make graphs for these petStats and battleStats, abilityStats should be like the totalMatches,
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

  const matchesByRegion = [
    {
      region: 'EU',
      value: matches?.filter((m) => m.region === 'EU').length || 0,
    },
    {
      region: 'NA',
      value: matches?.filter((m) => m.region === 'NA').length || 0,
    },
    {
      region: 'OCE',
      value: matches?.filter((m) => m.region === 'OCE').length || 0,
    },
    {
      region: 'CN',
      value: matches?.filter((m) => m.region === 'CN').length || 0,
    },
    {
      region: 'Other',
      value:
        matches?.filter((m) => !['EU', 'NA', 'OCE', 'CN'].includes(m.region))
          .length || 0,
    },
  ];

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
        matchesByRegion: [],
        battleResults: [],
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

  const battleResults = [
    {
      result: 'WINS',
      value: battleLogs.filter((b) => b.result === 'WIN').length || 0,
    },
    {
      result: 'LOSSES',
      value: battleLogs.filter((b) => b.result === 'LOSS').length || 0,
    },
    {
      result: 'DRAWS',
      value: battleLogs.filter((b) => b.result === 'DRAW').length || 0,
    },
  ];

  return {
    generalStats: {
      averageDuration: calculateAverageDuration(battleLogs),
      totalBattles: battleLogs.length,
      totalMatches: matches?.length,
      matchesByRegion,
      battleResults,
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}
// TODO: for later to set the battle result per match as well
export async function getMatchBattleStats(
  tournamentId: string,
  matchId: string
): Promise<{
  generalStats: {
    averageDuration: string;
    totalBattles: number;
    totalMatches?: number;
    matchesByRegion?: {
      region: string;
      value: number;
    }[];
    battleResults?: {
      result: string;
      value: number;
    }[];
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
        totalMatches: 0,
        matchesByRegion: [],
        battleResults: [],
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

  const battleResults = [
    {
      result: 'WINS',
      value: battleLogs.filter((b) => b.result === 'WIN').length || 0,
    },
    {
      result: 'LOSSES',
      value: battleLogs.filter((b) => b.result === 'LOSS').length || 0,
    },
    {
      result: 'DRAWS',
      value: battleLogs.filter((b) => b.result === 'DRAW').length || 0,
    },
  ];

  return {
    generalStats: {
      averageDuration: calculateAverageDuration(battleLogs),
      totalBattles: battleLogs.length,
      totalMatches: 0,
      matchesByRegion: [],
      battleResults,
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}
