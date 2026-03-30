import { Heading, Paragraph } from '@/components/ui';
import { OverviewCardProps } from '@/types/components.types';

export function OverviewCard({ title, value }: OverviewCardProps) {
  return (
    <div className='bg-background p-2.5 lg:p-5 rounded-lg shadow-md w-full lg:w-[23.75%]'>
      <Heading as='h3' className='text-xl text-muted-foreground'>
        {title}
      </Heading>
      <Paragraph className='text-4xl text-humanoid font-bold'>
        {value}
      </Paragraph>
    </div>
  );
}
