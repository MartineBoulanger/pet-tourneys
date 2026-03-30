import { Props } from 'recharts/types/component/ResponsiveContainer';
import { TooltipContentProps } from 'recharts';

// =================================================
// Types that set the structure of the data/objects
// =================================================
export type DataType = {
  name: string | number;
  value: number | string;
};
export type DataTypeWithFill = {
  name: string | number;
  value: number | string;
  fill: string;
};
export type DataTypeWithMultiValues = {
  name: string | number;
  value1: number | string;
  value2: number | string;
};
export type StringObjType = Record<string, string>;

// =================================================
// Generic type with props that can be used
// - in all graphs components
// =================================================
export type GraphsProps<T> = {
  data: T[] | undefined;
  fillColors?: StringObjType;
  tooltip?: string;
  showLegend?: boolean;
  color?: string;
  showWholeLabel?: boolean;
};

// =================================================
// Component types
// =================================================
export type GraphWrapperProps = Props & {
  containerHeight?: number | string;
};

export type RadarGraphProps = GraphsProps<DataType> & {
  legendText?: string;
  radarName?: string;
  angle?: number;
};

export type BarGraphProps = GraphsProps<DataType> & {
  color2?: string;
};

export type ScatterGraphProps = GraphsProps<DataType> & {
  tooltipNamePrefix?: string;
  colors?: string[];
};

export type DoublePieGraphProps = GraphsProps<DataType> & {
  data2: DataType[] | undefined;
  fillColors2?: StringObjType;
};

export type DoubleBarGraphProps = GraphsProps<DataTypeWithMultiValues> & {
  color2?: string;
  tooltip2?: string;
  legendValues?: StringObjType;
};

type LegendPayloadItem = {
  value?: string;
  color?: string;
};

export type CustomLegendProps = {
  payload?: readonly LegendPayloadItem[];
  fillColors?: Record<string, string>;
  legendValues?: Record<string, string>;
};

type TooltipItem = {
  label: string;
  value?: string | number;
  prefix?: string;
};

export type CustomTooltipProps = TooltipContentProps & {
  items?: TooltipItem[];
  prefix?: string;
  capitalize?: boolean;
  isRadial?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPercentage?: (value: number, payload: any) => string;
};
