import { GoDotFill } from 'react-icons/go';
import { CustomLegendProps } from '@/types/graphs.types';

export function CustomLegend({
  payload,
  fillColors,
  legendValues,
}: CustomLegendProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <ul className='flex gap-2.5 lg:gap-5 items-center justify-center'>
      {payload.map((entry, index) => (
        <li
          key={index}
          className='flex items-center gap-1'
          style={{
            color: fillColors?.[entry.value ?? ''] ?? entry.color ?? '#f1f1f1',
          }}
        >
          <GoDotFill />
          {legendValues?.[entry.value ?? ''] ?? entry.value ?? ''}
        </li>
      ))}
    </ul>
  );
}
