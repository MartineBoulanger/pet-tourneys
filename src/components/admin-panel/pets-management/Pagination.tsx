'use client';

import { Button, Select, Option } from '@/components/ui';
import { cn } from '@/utils/cn';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AdminPaginationProps } from '@/types/components.types';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}: AdminPaginationProps) {
  const pageSizeOptions = [10, 20, 50, 100];

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='bg-background px-2.5 lg:p-5 rounded-b-lg flex flex-col sm:flex-row items-center justify-between gap-4 py-4'>
      <div className='flex items-center gap-2 text-sm text-foreground/70'>
        <span>{'Show'}</span>
        <Select
          label='Page Size'
          id='page-size'
          name='page-size'
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className='px-2 py-1'
        >
          {pageSizeOptions.map((size) => (
            <Option key={size} value={`${size}`} label={`${size}`} />
          ))}
        </Select>
        <span>{'per page'}</span>
        <span className='ml-2 border-l border-humanoid pl-3.5'>
          {`${(currentPage - 1) * pageSize + 1}-${Math.min(
            currentPage * pageSize,
            totalItems,
          )} of ${totalItems}`}
        </span>
      </div>

      <div className='flex items-center gap-1'>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-full mr-1.5',
            currentPage === 1 ? 'cursor-not-allowed bg-light-grey' : '',
          )}
        >
          <FaChevronLeft
            className={cn(
              'h-4 w-4',
              currentPage === 1 ? 'text-foreground/30' : '',
            )}
          />
        </Button>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={currentPage === page ? 'primary' : 'link'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className={cn(
              'bg-transparent',
              currentPage === page
                ? 'p-1.5 border-2 border-humanoid'
                : 'border-2 border-transparent p-1.5 hover:border-light-blue',
              typeof page !== 'number'
                ? 'cursor-default hover:border-transparent'
                : '',
            )}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-full ml-1.5',
            currentPage === totalPages
              ? 'cursor-not-allowed bg-light-grey'
              : '',
          )}
        >
          <FaChevronRight
            className={cn(
              'h-4 w-4',
              currentPage === totalPages ? 'text-foreground/30' : '',
            )}
          />
        </Button>
      </div>
    </div>
  );
}
