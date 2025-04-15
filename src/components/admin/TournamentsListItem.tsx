import Link from 'next/link';
import { Tournament } from '@/types';
import { AdminTournamentActions } from './AdminTournamentActions';
import { PopUp } from '@/components/ui';

interface TournamentsListItemProps {
  tournament: Tournament;
}

export const TournamentsListItem = ({
  tournament,
}: TournamentsListItemProps) => {
  return (
    <div className='p-4 rounded-lg shadow-md bg-light-grey'>
      <div className='flex justify-between items-center'>
        <div>
          <Link href={`/tournaments/${tournament.id}`} className='link'>
            {tournament.name}
          </Link>
          <p className='text-sm text-gray-500 mt-2'>
            {new Date(tournament.start_date).toLocaleDateString()} -{' '}
            {tournament.end_date === '1999-12-31T22:00:00' ||
            tournament.end_date === null
              ? 'Ongoing'
              : tournament.end_date &&
                new Date(tournament.end_date).toLocaleDateString()}
          </p>
          <p className='text-sm text-gray-500'>
            {tournament.participant_count}
            {' participants'}
          </p>
        </div>
        <div className='hidden md:block'>
          <AdminTournamentActions id={tournament.id} name={tournament.name} />
        </div>
        <PopUp className='md:hidden'>
          <AdminTournamentActions id={tournament.id} name={tournament.name} />
        </PopUp>
      </div>
    </div>
  );
};
