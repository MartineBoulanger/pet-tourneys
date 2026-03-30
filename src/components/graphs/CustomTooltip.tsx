import { capitalizeWord } from '@/utils/capitalizeWord';
import { CustomTooltipProps } from '@/types/graphs.types';

export function CustomTooltip({
  active,
  payload,
  label,
  items,
  prefix,
  capitalize = false,
  isRadial = false,
  getPercentage,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const title = label ?? payload[0]?.payload?.name;
  const displayTitle = capitalize ? capitalizeWord(title) : title;
  const dataItem = payload[0]?.payload;

  return (
    <div className='bg-light-grey p-2.5 rounded-lg shadow-md'>
      <p className='font-bold text-humanoid'>
        {isRadial ? payload[0]?.payload?.name : displayTitle}
      </p>
      {items ? (
        // Custom items passed in (for DoubleBarGraph etc.)
        items.map((item, i) => (
          <p key={i}>
            {item.label}
            {item.prefix}
            {item.value ?? payload[i]?.value}
          </p>
        ))
      ) : (
        // Single value (for BarGraph etc.)
        <p>
          {prefix}
          {payload[0]?.payload?.value}
          {getPercentage && ` (${getPercentage(dataItem?.value, payload[0])})`}
        </p>
      )}
    </div>
  );
}
