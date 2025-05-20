export function OverviewCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className='bg-background p-4 rounded-lg shadow-md w-full md:w-[25%]'>
      <h3 className='text-xl text-muted-foreground'>{title}</h3>
      <p className='text-4xl text-humanoid font-bold'>{value}</p>
    </div>
  );
}
