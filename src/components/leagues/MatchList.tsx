import Link from 'next/link';
import { MatchListProps } from '@/types/components.types';
import { Pagination } from '@/components/layout/Pagination';

export const MatchList = ({
  matches,
  id,
  currentPage = 1,
  totalPages = 1,
}: MatchListProps) => {
  return (
    <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 mt-2.5'>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-5'>
        {matches.map((match) => (
          <Link
            key={match.id}
            href={`/leagues/${id}/match/${match.id}`}
            className='py-5 px-2.5 lg:px-5 rounded-lg shadow-md bg-background hover:scale-105 transition-all duration-300 ease-in-out '
            title={`${match.player1} vs ${match.player2}`}
            aria-label={`${match.player1} vs ${match.player2}`}
          >
            <span className='flex flex-col flex-wrap justify-center items-center'>
              <span className='text-lg font-medium'>
                {match.player1}
                {' vs '}
                {match.player2}
              </span>
              <span className='flex text-humanoid'>
                <span className='text-sm'>
                  {new Date(match.date).toLocaleDateString()}
                </span>
                <span className='w-[1px] h-5 bg-light-grey mx-2.5 lg:mx-5 rounded-full' />
                <span className='text-sm'>{match.region}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/leagues/${id}`}
          className='mt-5'
        />
      ) : null}
    </div>
  );
};
