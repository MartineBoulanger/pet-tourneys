import Link from 'next/link';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PageSection } from './PageSection';
import { Banner } from '@/components/layout/Banner';
import { Page } from '@/types/supabase.types';
import { cn } from '@/utils/cn';

export function PageDetails({
  page,
  type,
}: {
  page: Page | null;
  type: Page['type'];
}) {
  if (!page) return null;

  return (
    <div className='relative'>
      {page?.bannerimage ? <Banner bannerimage={page?.bannerimage} /> : null}
      <div className='flex flex-col px-5 mb-5'>
        {page?.title ? (
          <Heading
            className={cn('mb-0', page.bannerimage ? 'mt-[600px]' : 'mt-10')}
          >
            {page.title}
          </Heading>
        ) : null}
        <Container className='p-2.5 lg:p-5 bg-light-grey w-full rounded-lg shadow-md flex flex-col gap-y-2.5 lg:gap-y-5'>
          <div className='flex items-center justify-between'>
            {page?.author ? (
              <Paragraph className='font-bold text-foreground/60 text-sm leading-none'>
                {`written by `}
                <span className='text-humanoid italic text-base'>
                  {page.author}
                </span>
              </Paragraph>
            ) : null}
            <Link
              href={`/${type}`}
              className='link self-end text-light-blue'
              title='Back to Overview'
              aria-label='Back to Overview'
            >
              {'Back to Overview'}
            </Link>
          </div>
          {page?.sections && page?.sections?.length > 0
            ? page.sections.map((section, index) => (
                <PageSection key={index} section={section} />
              ))
            : null}
          <Link
            href={`/${type}`}
            className='link self-end text-light-blue'
            title='Back to Overview'
            aria-label='Back to Overview'
          >
            {'Back to Overview'}
          </Link>
        </Container>
      </div>
    </div>
  );
}
