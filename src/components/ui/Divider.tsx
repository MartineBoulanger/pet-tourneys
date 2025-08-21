import { cn } from '@/utils/cn';

interface DividerProps {
  alignment: 'horizontal' | 'vertical';
  color?: string;
  width?: string;
  height?: string;
}

export const Divider = ({
  alignment,
  color = 'foreground',
  width = 'full',
  height = 'full',
}: DividerProps) => {
  return (
    <div
      className={cn(
        'rounded-full',
        alignment === 'horizontal'
          ? `w-full h-${height} my-5`
          : `h-full w-${width} mx-5`,
        `bg-${color}`
      )}
    />
  );
};
