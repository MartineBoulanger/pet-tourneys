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

export interface ChartsProps<T> {
  data: T[] | undefined;
}

export interface ChartData {
  petUsageData: Array<PetUsageChartData>;
  petTypeData: Array<ChartDataItem>;
  petBreedData: Array<ChartDataItem>;
}

export interface BattleChartsProps {
  matchesStats?: {
    averageDuration?: string;
    totalBattles?: number;
    totalMatches?: number;
    matchesByRegion?: Array<ChartDataItem>;
    battleResults?: Array<ChartDataItem>;
    matchResults?: Array<ChartDataItem>;
  };
  isMatchView: boolean;
}

export interface PetBattleLogProps {
  battleStats: BattleStatistics;
  isMatchView?: boolean;
}

export interface PetAbilitiesProps {
  abilityStats: AbilityAnalysisResult;
}

export interface PetChartsProps extends ChartsProps<TournamentPetStat> {
  chartData: ChartData;
}

export interface PetListProps extends ChartsProps<TournamentPetStat> {
  isMatchView?: boolean;
}
