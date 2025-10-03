'use client';

import { useState, useMemo } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Page } from '@/features/cms/types';
import { PageCard } from './PageCard';
import { ITEMS_PER_PAGE } from '@/utils/constants';
import { Pagination, Input } from '@/components/ui';

export function PagesList({ pages, type }: { pages: Page[]; type: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Pagination page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter pages based on search query
  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;

    const query = searchQuery.toLowerCase();
    return pages.filter((page) => {
      const titleMatch = page.title.toLowerCase().includes(query);
      const textMatch = page.sections?.some((section) =>
        section.text?.toLowerCase().includes(query)
      );
      return titleMatch || textMatch;
    });
  }, [pages, searchQuery]);

  // get current pages per page
  const currentPages = filteredPages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredPages.length / ITEMS_PER_PAGE);

  if (!pages) return null;

  return (
    <>
      <div className='mt-5 lg:mt-10 rounded-lg shadow-md p-2.5 lg:p-5 bg-background w-full mx-auto relative flex-1'>
        <IoSearch className='w-4 h-4 absolute left-5 top-12 lg:left-8 lg:top-15 -translate-y-1/2 text-humanoid' />
        <Input
          label={`Search ${type}`}
          id='search'
          name='search'
          type='search'
          className='pl-10 w-full'
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div className='bg-light-grey mt-5 rounded-lg shadow-md p-2.5 lg:p-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5'>
          {currentPages.map((page, index) =>
            page.published ? (
              <PageCard key={page._id} page={page} index={index} />
            ) : null
          )}
        </div>
        {totalPages > 1 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/${type}`}
            onPageChange={handlePageChange}
            className='mb-2.5 mt-5 lg:mt-5'
          />
        ) : null}
      </div>
    </>
  );
}
