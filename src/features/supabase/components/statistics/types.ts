import {
  AbilityAnalysisResult,
  BattleStatistics,
  TournamentPetStat,
} from '@/features/supabase/types';

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

export interface Pet {
  petID: string;
  name: string;
  type: string;
  isTradable: string;
  baseHealth: string;
  basePower: string;
  baseSpeed: string;
  ability1: string;
  ability2: string;
  ability3: string;
  ability4: string;
  ability5: string;
  ability6: string;
  source: string;
  isCapturable: string;
  expansion: string;
  isHordeOnly: string;
  isAllianceOnly: string;
  description: string;
  availableBreeds: string;
  icon: string;
  image: string;
}

export interface PetStatsListProps {
  petData: Pet[];
  petStats: TournamentPetStat[];
  battleStats?: BattleStatistics;
  isMatchView?: boolean;
}

export enum TypesImages {
  Aquatic = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/aquatic.png',
  Beast = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/beast.png',
  Critter = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/critter.png',
  Dragonkin = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700958/pml-images/dragonkin.png',
  Elemental = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700958/pml-images/elemental.png',
  Flying = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/flying.png',
  Humanoid = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/humanoid.png',
  Magic = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/magic.png',
  Mechanical = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/mechanical.png',
  Undead = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/undead.png',
}

export interface PetControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  filters: {
    type: string;
    expansion: string;
    breed: string;
    source: string;
    tradable: boolean;
    capturable: boolean;
    isAllianceOnly: boolean;
    isHordeOnly: boolean;
  };
  onFilterChange: (key: string, value: string | boolean) => void;
  onResetFilters: () => void;
  uniqueStats: {
    types: string[];
    expansions: string[];
    breeds: string[];
    sources: string[];
  };
  isMatchView?: boolean;
}

export type SortOption = {
  value: string;
  label: string;
};
