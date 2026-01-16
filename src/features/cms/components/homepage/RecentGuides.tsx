import Link from 'next/link';
import { Page } from '@/features/cms/types';
import { Heading, Paragraph } from '@/components/ui';

type Props = {
  pages: Page[];
};

export function RecentGuides({ pages }: Props) {
  const recentGuides = pages.slice(0, 2);

  return (
    <div className='rounded-lg bg-background p-2.5 lg:px-5 shadow-md flex flex-col gap-2.5'>
      <Heading
        as='h2'
        className='text-2xl lg:text-3xl text-foreground/90 mx-auto'
      >
        {'Recent Guides'}
      </Heading>

      {recentGuides.length > 0 ? (
        <ul className='space-y-2'>
          {recentGuides.map((page) => (
            <li key={page._id}>
              <Link
                href={`/guides/${page.slug}`}
                className='btn-link flex justify-between items-center rounded-lg p-2.5 bg-light-grey hover:bg-blue-grey'
              >
                <span className='text-sm text-foreground'>{page.title}</span>
                <time
                  dateTime={String(page.createdAt)}
                  className='text-xs text-humanoid'
                >
                  {new Date(page.createdAt).toLocaleDateString()}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Paragraph className='text-center bg-light-grey py-2.5 rounded-lg'>
          {'No guides yet'}
        </Paragraph>
      )}
      {recentGuides.length > 0 ? (
        <div className='text-center'>
          <Link href='/guides' className='link'>
            {'View All Guides'}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
