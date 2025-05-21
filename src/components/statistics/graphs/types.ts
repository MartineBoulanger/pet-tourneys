export interface RadarGraphProps {
  data: { name: number | string; value: number | string }[] | undefined;
  color?: string;
  texts: {
    tooltip: string;
    legend: string;
    radarName: string;
  };
}

export interface PieGraphProps {
  data: { name: string | number; value: number | string }[] | undefined;
  hasLegend?: boolean;
  fillColors?: Record<string, string>;
  tooltip: string;
}

export interface DoublePieGraphProps {
  dataInner: { name: string; value: number }[] | undefined;
  dataOuter: { name: string; value: number }[] | undefined;
  fillColorsInner?: Record<string, string>;
  fillColorsOuter?: Record<string, string>;
  tooltip: string;
}

export interface ScatterGraphProps {
  data: { name: string | number; value: number | string }[] | undefined;
  fillColors?: string[];
  tooltipNamePrefix?: string;
  tooltip: string;
}

export interface DoubleBarGraphProps {
  data:
    | {
        name: string | number;
        value1: number | string;
        value2: number | string;
      }[]
    | undefined;
  fillColorValue1?: string;
  fillColorValue2?: string;
  tooltipValue1: string;
  tooltipValue2: string;
  legendValues?: Record<string, string>;
  showLegend?: boolean;
}

export interface RadialGraphProps {
  data:
    | {
        name: string | number;
        value: number | string;
        fill: string;
      }[]
    | undefined;
  tooltip: string;
  showLegend?: boolean;
}
