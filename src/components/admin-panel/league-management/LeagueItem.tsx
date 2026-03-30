import Link from 'next/link';
import { Paragraph } from '@/components/ui';
import { LeagueItemProps } from '@/types/components.types';
import { LeagueActions } from './LeagueActions';

export const LeagueItem = ({ league }: LeagueItemProps) => {
  if (!league) return null;

  return (
    <div className='p-2.5 lg:px-5 rounded-lg shadow-md bg-background'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <Link
            href={`/leagues/${league.id}`}
            className='link font-bold text-humanoid'
            title={league.name}
            aria-label={league.name}
          >
            {league.name}
          </Link>
          <Paragraph className='text-sm text-foreground/50'>
            {`Start: ${new Date(league.start_date).toLocaleString()} - ${
              league.end_date === '1999-12-31T22:00:00' ||
              league.end_date === null
                ? 'Ongoing'
                : `End: ${league.end_date && new Date(league.end_date).toLocaleString()}`
            }`}
          </Paragraph>
          <Paragraph className='text-sm text-foreground/80'>
            {league.participant_count}
            {' participants'}
          </Paragraph>
        </div>
        <LeagueActions id={league.id} name={league.name} />
      </div>
    </div>
  );
};
