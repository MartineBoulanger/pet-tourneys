import Link from 'next/link';
import { Pagination } from '@/components/layout/Pagination';
import { LeaguesListProps } from '@/types/components.types';

export const LeaguesList = ({
  leagues,
  currentPage = 1,
  totalPages = 1,
}: LeaguesListProps) => {
  return (
    <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 mt-2.5'>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-5'>
        {leagues.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${league.id}`}
            className='py-5 px-2.5 lg:px-5 rounded-lg shadow-md bg-background hover:scale-105 transition-all duration-300 ease-in-out'
            title={league.name}
            aria-label={league.name}
          >
            <span className='flex flex-col flex-wrap justify-center items-center'>
              <span className='text-lg font-medium'>{league.name}</span>
              <span className='flex text-humanoid'>
                <span className='text-sm'>
                  {new Date(league.start_date).toLocaleDateString()}
                  {' - '}
                  {league.end_date === '1999-12-31T22:00:00' ||
                  league.end_date === null
                    ? 'Ongoing'
                    : league.end_date &&
                      new Date(league.end_date).toLocaleDateString()}
                </span>
                <span className='w-[1px] h-5 bg-light-grey mx-2.5 lg:mx-5 rounded-full' />
                <span className='text-sm'>
                  {league.participant_count}
                  {' participants'}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={'/leagues'}
          className='mt-5'
        />
      ) : null}
    </div>
  );
};
