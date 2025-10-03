import Link from 'next/link';
import { Page } from '@/features/cms/types';
import { getTypeLabel } from '@/features/cms/utils';
import { Heading, Container, Paragraph } from '@/components/ui';

type RecentPagesSectionProps = {
  data: {
    type: string;
    pages: Page[];
  }[];
};

export function RecentPagesSection({ data }: RecentPagesSectionProps) {
  return (
    <Container className='grid gap-2.5 lg:gap-5 lg:grid-cols-3 py-2.5 lg:py-5'>
      {data.map(({ type, pages }) => (
        <div
          key={type}
          className='rounded-lg bg-background p-2.5 lg:p-5 shadow-md'
        >
          <Heading
            as='h2'
            className='text-2xl lg:text-3xl text-foreground/90 mx-auto mb-2.5'
          >{`Recent ${getTypeLabel(type)}s`}</Heading>
          <ul className='space-y-2.5'>
            {pages.length > 0 ? (
              pages.map((page) => (
                <li key={page._id}>
                  <Link
                    href={`/${type}/${page.slug}`}
                    className='btn-link flex justify-between items-center rounded-lg p-2.5 bg-light-grey hover:bg-blue-grey'
                  >
                    <span className='text-sm text-foreground'>
                      {page.title}
                    </span>
                    <time
                      dateTime={String(page.createdAt)}
                      className='text-xs text-humanoid'
                    >
                      {new Date(page.createdAt).toLocaleDateString()}
                    </time>
                  </Link>
                </li>
              ))
            ) : (
              <Paragraph className='text-center bg-light-grey py-2.5 rounded-lg'>{`No recent ${getTypeLabel(
                type
              ).toLowerCase()}s yet`}</Paragraph>
            )}
          </ul>
        </div>
      ))}
    </Container>
  );
}
