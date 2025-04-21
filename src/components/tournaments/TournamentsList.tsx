import Link from 'next/link';
import { TournamentsListProps } from '@/types';

export const TournamentsList = ({ tournaments }: TournamentsListProps) => {
  return (
    <div className='grid gap-4'>
      {tournaments.map((tournament) => (
        <Link
          key={tournament.id}
          href={`/tournaments/${tournament.id}`}
          className='p-4 rounded-lg shadow-md bg-light-grey hover:bg-blue-grey transition'
          title={tournament.name}
          aria-label={tournament.name}
        >
          <span className='flex flex-wrap justify-between items-center'>
            <span className='text-lg font-medium leading-normal font-warcraft tracking-[1.5px]'>
              {tournament.name}
            </span>
            <span className='flex'>
              <span className='text-sm text-gray-500'>
                {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                {tournament.end_date === '1999-12-31T22:00:00' ||
                tournament.end_date === null
                  ? 'Ongoing'
                  : tournament.end_date &&
                    new Date(tournament.end_date).toLocaleDateString()}
              </span>
              <span className='w-[1px] h-5 bg-gray-500 mx-5 rounded-full' />
              <span className='text-sm text-gray-500'>
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
