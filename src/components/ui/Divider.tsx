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
          ? `w-${width} h-${height} my-5 mx-auto`
          : `h-${height} w-${width} mx-5 my-auto`,
        `bg-${color}`
      )}
    />
  );
};
