export interface ChartProps {
  data: any[];
  width?: string | number;
  height?: string | number;
  colors?: string[];
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  showLegend?: boolean;
  legendProps?: any;
  tooltipProps?: any;
  [key: string]: any; // Allow any additional props
}

export interface BarGraphProps {
  data:
    | {
        name: string;
        type?: string;
        stats?: string[];
        breeds?: string[];
      }[]
    | undefined;
  defaultColor?: string;
  tooltipTextColor?: string;
  tooltipHoverColor?: string;
}

export interface iLineGraphProps extends ChartProps {
  xAxisKey: string;
  lineDataKeys: string[] | { key: string; color?: string }[];
  gridProps?: any;
  lineProps?: any;
}

export interface iRadarGraphProps extends ChartProps {
  polarAngleKey: string;
  radarDataKey: string;
  polarRadiusProps?: any;
}

export interface iPieGraphProps extends ChartProps {
  dataKey: string;
  nameKey?: string;
  outerRadius?: number;
  label?: boolean;
  labelProps?: any;
}

export interface iBarGraphProps extends ChartProps {
  xAxisKey: string;
  barDataKeys: string[] | { key: string; color?: string }[];
  barProps?: any;
  layout?: 'horizontal' | 'vertical';
}
