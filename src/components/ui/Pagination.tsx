import Link from 'next/link';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParam?: string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  baseUrl,
  queryParam = 'page',
  className = '',
  onPageChange, // only use this prop when data is already parsed and does not have to be called per page at the database
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    if (onPageChange) onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxAdjacent = 1; // Number of pages to show adjacent to current page

    // Always show first page
    pages.push(1);

    // Show ellipsis after first page if current page is far from start
    if (currentPage > maxAdjacent + 2) {
      pages.push('...');
    }

    // Calculate range of pages around current page
    const startPage = Math.max(2, currentPage - maxAdjacent);
    const endPage = Math.min(totalPages - 1, currentPage + maxAdjacent);

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Show ellipsis before last page if current page is far from end
    if (currentPage < totalPages - (maxAdjacent + 1)) {
      pages.push('...');
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <span
            key={`ellipsis-${index}`}
            className='flex h-5 w-5 items-center justify-center rounded-md'
          >
            ...
          </span>
        );
      }

      return onPageChange ? (
        <Button
          key={page}
          onClick={() => handlePageChange(Number(page))}
          className={`flex h-10 w-10 items-center justify-center rounded-md font-bold bg-transparent ${
            currentPage === page
              ? 'bg-humanoid text-background'
              : 'hover:bg-background hover:text-foreground'
          }`}
          aria-disabled={currentPage === page}
          title={`Page ${page}`}
          aria-label={`Page ${page}`}
        >
          {page}
        </Button>
      ) : (
        <Link
          key={page}
          href={`${baseUrl}?${queryParam}=${page}`}
          className={`flex h-10 w-10 items-center justify-center rounded-md font-bold ${
            currentPage === page
              ? 'bg-humanoid text-background'
              : 'hover:bg-background hover:text-foreground'
          }`}
          aria-disabled={currentPage === page}
          title={`Page ${page}`}
          aria-label={`Page ${page}`}
        >
          {page}
        </Link>
      );
    });
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      {onPageChange ? (
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`flex items-center justify-center p-2 rounded-lg bg-transparent ${
            currentPage === 1
              ? 'opacity-40 cursor-default'
              : 'hover:bg-light-grey'
          }`}
          disabled={currentPage === 1}
          title='Previous'
          aria-label='Previous'
        >
          <FaChevronLeft className='h-6 w-6' />
          <span className='sr-only'>Previous</span>
        </Button>
      ) : (
        <Link
          href={`${baseUrl}?${queryParam}=${currentPage - 1}`}
          className={`flex items-center justify-center p-2 rounded-lg ${
            currentPage === 1
              ? 'opacity-40 cursor-default'
              : 'hover:bg-light-grey'
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : undefined}
          title='Previous'
          aria-label='Previous'
        >
          <FaChevronLeft className='h-6 w-6' />
          <span className='sr-only'>Previous</span>
        </Link>
      )}

      {/* Page Numbers */}
      <div className='flex items-center gap-1.5'>{renderPageNumbers()}</div>

      {/* Next Button */}
      {onPageChange ? (
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`flex items-center justify-center p-2 rounded-lg bg-transparent ${
            currentPage === totalPages
              ? 'opacity-40 cursor-default'
              : 'hover:bg-light-grey'
          }`}
          disabled={currentPage === totalPages}
          title='Next'
          aria-label='Next'
        >
          <FaChevronRight className='h-6 w-6' />
          <span className='sr-only'>Next</span>
        </Button>
      ) : (
        <Link
          href={`${baseUrl}?${queryParam}=${currentPage + 1}`}
          className={`flex items-center justify-center p-2 rounded-lg ${
            currentPage === totalPages
              ? 'opacity-40 cursor-default'
              : 'hover:bg-light-grey'
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : undefined}
          title='Next'
          aria-label='Next'
        >
          <FaChevronRight className='h-6 w-6' />
          <span className='sr-only'>Next</span>
        </Link>
      )}
    </div>
  );
};
