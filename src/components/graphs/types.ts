export interface PetUsageBarChartProps {
  pets: {
    name: string;
    total_played: number;
    stats?: string[];
    breeds?: string[];
    type?: string;
  }[];
  defaultColor?: string;
  maxMobileItems?: number;
}

export interface PetUsagePieChartProps {
  types: { name: string; value: number }[] | undefined;
  breeds: { name: string; value: number }[] | undefined;
  defaultColor?: string;
}

export interface PetUsageScatterChartProps {
  data: { count: number; value: number }[] | undefined;
  stat: string;
  defaultColor?: string;
}

export interface RegionMatchesPieChartProps {
  regions: { region: string; value: number }[] | undefined;
  defaultColor?: string;
}

export interface BattleResultsPieChartProps {
  results: { result: string; value: number }[] | undefined;
  defaultColor?: string;
}
