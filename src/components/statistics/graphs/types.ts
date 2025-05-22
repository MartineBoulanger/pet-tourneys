import { Props } from 'recharts/types/component/ResponsiveContainer';

// Types that set the structure of the data/objects
type DataType = {
  name: string | number;
  value: number | string;
};
type DataTypeWithFill = {
  name: string | number;
  value: number | string;
  fill: string;
};
type DataTypeWithMultiValues = {
  name: string | number;
  value1: number | string;
  value2: number | string;
};
type StringObjType = Record<string, string>;

// Generic interface with props that can be used in all graphs components
interface GraphsProps<T> {
  data: T[] | undefined;
  fillColors?: StringObjType;
  tooltip?: string;
  showLegend?: boolean;
  color?: string;
}

// Component interfaces
export interface GraphWrapperProps extends Props {
  containerHeight?: number | string;
}

export interface PieGraphProps extends GraphsProps<DataType> {}

export interface RadarGraphProps extends GraphsProps<DataType> {
  legendText?: string;
  radarName?: string;
  angle?: number;
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

export interface RadialGraphProps extends GraphsProps<DataTypeWithFill> {}
