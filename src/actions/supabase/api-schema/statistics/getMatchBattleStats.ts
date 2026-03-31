'use server';

import { apiTable } from '@/actions/supabase/actions';
import { BattleLogsStats } from '@/types/supabase.types';
import { analyzeUsedAbilities } from '@/utils/supabase/analyzeUsedAbilities';
import { calculateAverageDuration } from '@/utils/supabase/calculateAverageDuration';
import { getMostUsedPets } from '@/utils/supabase/getMostUsedPets';
import { parseBattleStatistics } from '@/utils/supabase/parseBattleStats';

export async function getMatchBattleStats(
  id: string,
  matchId: string,
): Promise<BattleLogsStats> {
  const bl = await apiTable('battle_logs', id);

  const { data: battleLogs, error } = await bl
    .select('*')
    .eq('match_id', matchId);

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
      totalMatches: 0,
      matchesByRegion: [],
      battleResults,
      matchResults: [],
    },
    petStats: getMostUsedPets(battleLogs),
    abilityStats: analyzeUsedAbilities(battleLogs),
    battleStats: parseBattleStatistics(battleLogs),
  };
}
