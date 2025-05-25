import Link from 'next/link';
import { TournamentsListProps } from './types';

export const TournamentsList = ({ tournaments }: TournamentsListProps) => {
  return (
    <div className='grid gap-2.5'>
      {tournaments.map((tournament) => (
        <Link
          key={tournament.id}
          href={`/tournaments/${tournament.id}`}
          className='p-5 rounded-lg shadow-md bg-background hover:bg-blue-grey transition'
          title={tournament.name}
          aria-label={tournament.name}
        >
          <span className='flex flex-wrap justify-between items-center'>
            <span className='text-lg font-medium leading-normal tracking-[1.5px]'>
              {tournament.name}
            </span>
            <span className='flex text-humanoid'>
              <span className='text-sm'>
                {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                {tournament.end_date === '1999-12-31T22:00:00' ||
                tournament.end_date === null
                  ? 'Ongoing'
                  : tournament.end_date &&
                    new Date(tournament.end_date).toLocaleDateString()}
              </span>
              <span className='w-[1px] h-5 bg-light-grey mx-5 rounded-full' />
              <span className='text-sm'>
                {tournament.participant_count}
                {' participants'}
              </span>
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
};
