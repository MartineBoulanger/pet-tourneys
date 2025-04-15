import Link from 'next/link';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParam?: string;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  queryParam = 'page',
  className = '',
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <Link
        href={`${baseUrl}?${queryParam}=${currentPage - 1}`}
        className={`flex items-center justify-center p-2 rounded-lg ${
          currentPage === 1
            ? 'opacity-40 cursor-default'
            : 'hover:bg-light-grey'
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <FaChevronLeft className='h-6 w-6' />
        <span className='sr-only'>Previous</span>
      </Link>

      {/* Page Numbers */}
      <div className='flex items-center gap-1.5'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`${baseUrl}?${queryParam}=${page}`}
            className={`flex h-10 w-10 items-center justify-center rounded-md ${
              currentPage === page
                ? 'bg-blue-grey text-foreground cursor-default'
                : 'hover:bg-blue-grey'
            }`}
            aria-disabled={currentPage === page}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      <Link
        href={`${baseUrl}?${queryParam}=${currentPage + 1}`}
        className={`flex items-center justify-center p-2 rounded-lg ${
          currentPage === totalPages
            ? 'opacity-40 cursor-default'
            : 'hover:bg-light-grey'
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        <FaChevronRight className='h-6 w-6' />
        <span className='sr-only'>Next</span>
      </Link>
    </div>
  );
};
