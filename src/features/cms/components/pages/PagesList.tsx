import { Page } from '@/features/cms/types';
import { PageCard } from './PageCard';

// TODO: add pagination with 12 page cards per page -> see commercial LLBG for implementing pagination for Contentful

export function PagesList({ pages }: { pages: Page[] }) {
  if (!pages) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5 bg-light-grey mt-5 lg:mt-10 rounded-lg shadow-md p-2.5 lg:p-5'>
      {pages.map((page, index) =>
        page.published ? (
          <PageCard key={page._id} page={page} index={index} />
        ) : null
      )}
    </div>
  );
}
