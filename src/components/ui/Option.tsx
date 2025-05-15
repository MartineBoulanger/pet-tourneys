interface OptionProps {
  value: string;
  label: string;
}

export const Option = ({ value, label }: OptionProps) => {
  return (
    <option value={value} className='bg-medium-grey text-foreground'>
      {label}
    </option>
  );
};
