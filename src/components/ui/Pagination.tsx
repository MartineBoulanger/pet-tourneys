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

      return (
        <Link
          key={page}
          href={`${baseUrl}?${queryParam}=${page}`}
          className={`flex h-10 w-10 items-center justify-center rounded-md ${
            currentPage === page
              ? 'bg-blue-grey text-foreground cursor-default'
              : 'hover:bg-blue-grey'
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

      {/* Page Numbers */}
      <div className='flex items-center gap-1.5'>{renderPageNumbers()}</div>

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
        title='Next'
        aria-label='Next'
      >
        <FaChevronRight className='h-6 w-6' />
        <span className='sr-only'>Next</span>
      </Link>
    </div>
  );
};
