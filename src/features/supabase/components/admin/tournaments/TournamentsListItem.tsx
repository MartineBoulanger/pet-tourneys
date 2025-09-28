import Link from 'next/link';
import { Paragraph } from '@/components/ui';
import { Tournament } from '@/features/supabase/components/tournaments/TournamentsList';
import { AdminTournamentActions } from './AdminTournamentActions';

interface TournamentsListItemProps {
  tournament: Tournament;
}

export const TournamentsListItem = ({
  tournament,
}: TournamentsListItemProps) => {
  if (!tournament) return null;

  return (
    <div className='p-2.5 lg:px-5 rounded-lg shadow-md bg-background'>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <Link
            href={`/tournaments/${tournament.id}`}
            className='link text-foreground font-bold'
            title={tournament.name}
            aria-label={tournament.name}
          >
            {tournament.name}
          </Link>
          <Paragraph className='text-sm lg:text-base text-humanoid mt-2.5'>
            {new Date(tournament.start_date).toLocaleDateString()} -{' '}
            {tournament.end_date === '1999-12-31T22:00:00' ||
            tournament.end_date === null
              ? 'Ongoing'
              : tournament.end_date &&
                new Date(tournament.end_date).toLocaleDateString()}
          </Paragraph>
          <Paragraph className='text-sm lg:text-base text-humanoid'>
            {tournament.participant_count}
            {' participants'}
          </Paragraph>
        </div>
        <AdminTournamentActions id={tournament.id} name={tournament.name} />
      </div>
    </div>
  );
};
