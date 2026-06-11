import { capitalizeWord } from '@/utils/capitalizeWord';
import { CustomTooltipProps } from '@/types/graphs.types';
import { Paragraph } from '@/components/ui';

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
      <Paragraph className='font-bold text-humanoid'>
        {isRadial ? payload[0]?.payload?.name : displayTitle}
      </Paragraph>
      {items ? (
        // Custom items passed in (for DoubleBarGraph etc.)
        items.map((item, i) => (
          <Paragraph key={i}>
            {item.label}
            {item.prefix}
            {item.value ?? payload[i]?.value}
          </Paragraph>
        ))
      ) : (
        // Single value (for BarGraph etc.)
        <Paragraph>
          {prefix}
          {payload[0]?.payload?.value}
          {getPercentage && ` (${getPercentage(dataItem?.value, payload[0])})`}
        </Paragraph>
      )}
    </div>
  );
}
