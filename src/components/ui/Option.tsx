import { OptionProps } from '@/types/components.types';

export const Option = ({ value, label }: OptionProps) => {
  return (
    <option value={value} className='bg-medium-grey text-foreground'>
      {label}
    </option>
  );
};
