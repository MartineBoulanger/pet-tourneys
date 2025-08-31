import { Props } from 'recharts/types/component/ResponsiveContainer';

// Types that set the structure of the data/objects
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

// Generic interface with props that can be used in all graphs components
export interface GraphsProps<T> {
  data: T[] | undefined;
  fillColors?: StringObjType;
  tooltip?: string;
  showLegend?: boolean;
  color?: string;
  showWholeLabel?: boolean;
}

// Component interfaces
export interface GraphWrapperProps extends Props {
  containerHeight?: number | string;
}

export interface RadarGraphProps extends GraphsProps<DataType> {
  legendText?: string;
  radarName?: string;
  angle?: number;
}

export interface BarGraphProps extends GraphsProps<DataType> {
  color2?: string;
}

export interface ScatterGraphProps extends GraphsProps<DataType> {
  tooltipNamePrefix?: string;
  colors?: string[];
}

export interface DoublePieGraphProps extends GraphsProps<DataType> {
  data2: DataType[] | undefined;
  fillColors2?: StringObjType;
}

export interface DoubleBarGraphProps
  extends GraphsProps<DataTypeWithMultiValues> {
  color2?: string;
  tooltip2?: string;
  legendValues?: StringObjType;
}
