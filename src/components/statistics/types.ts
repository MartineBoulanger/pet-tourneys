import {
  AbilityAnalysisResult,
  BattleStatistics,
  TournamentPetStat,
} from '@/utils/types';

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface PetUsageChartData extends ChartDataItem {
  stats: string[];
  type: string;
  breeds: string[];
  total_played: number;
}

export interface ChartData {
  petUsageData: PetUsageChartData[];
  petTypeData: ChartDataItem[];
  petBreedData: ChartDataItem[];
}

export interface BattleAnalysisStatsProps {
  stats: {
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
    petStats: Array<{
      name: string;
      count: number;
      playerCount: number;
      opponentCount: number;
      team: 'player' | 'opponent' | 'both';
    }>;
    abilityStats: AbilityAnalysisResult;
    battleStats: BattleStatistics;
  };
  isMatchView?: boolean;
}

export interface PetBreedChartProps {
  breeds: { name: string; value: number }[] | undefined;
}

export interface PetChartsProps {
  chartData: ChartData;
  stats: TournamentPetStat[];
}

export interface PetListProps {
  stats: TournamentPetStat[];
  matchView?: boolean;
}

export interface PetStatCardProps {
  petStat: TournamentPetStat;
  rank?: number;
}

export interface PetStatListProps {
  petStats: TournamentPetStat[];
}

export interface PetStatsChartProps {
  pets: TournamentPetStat[];
}

export interface PetTypeChartProps {
  types: { name: string; value: number }[] | undefined;
}

export interface PetUsageChartProps {
  pets: PetUsageChartData[] | undefined;
}

export interface BattleChartsProps {
  matchesStats?: {
    averageDuration?: string;
    totalBattles?: number;
    totalMatches?: number;
    matchesByRegion?: {
      name: string;
      value: number;
    }[];
    battleResults?: {
      name: string;
      value: number;
    }[];
  };
}

export interface PetPerformanceChartsProps {
  battleStats: BattleStatistics;
}

export interface PetSwapsChartsProps {
  battleStats: BattleStatistics;
}
