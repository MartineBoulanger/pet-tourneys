export const Option = ({ value, label }: { value: string; label: string }) => {
  return (
    <option value={value} className='bg-medium-grey text-foreground'>
      {label}
    </option>
  );
};
