import Link from 'next/link';
import { RecentPagesSectionProps } from '@/types/components.types';
import { getPageTypeLabel } from '@/utils/supabase/getPageTypeLabel';
import { Heading, Container, Paragraph } from '@/components/ui';
import { RecentGuides } from './RecentGuides';
import { HallOfFame } from './hall-of-fame/HallOfFame';

export function RecentPagesSection({
  result,
  guides,
}: RecentPagesSectionProps) {
  return (
    <Container className='grid gap-2.5 lg:gap-5 lg:grid-cols-3 py-2.5 lg:py-5'>
      {result.map(({ type, data }) => (
        <div
          key={type}
          className='rounded-lg bg-background p-2.5 lg:px-5 shadow-md flex flex-col gap-5 justify-between'
        >
          <div className='space-y-5'>
            <Heading
              as='h2'
              className='text-2xl lg:text-3xl text-foreground/90 mx-auto'
            >{`Recent ${getPageTypeLabel(type)}s`}</Heading>
            <ul className='space-y-2.5'>
              {data && data.length > 0 ? (
                data.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/${type}/${page.slug}`}
                      className='btn-link flex justify-between items-center rounded-lg p-2.5 bg-light-grey hover:bg-blue-grey'
                    >
                      <span className='text-sm text-foreground lg:w-[80%] lg:truncate'>
                        {page.title}
                      </span>
                      <time
                        dateTime={String(page.createdat)}
                        className='text-xs text-humanoid'
                      >
                        {page.createdat?.split(',')[0]}
                      </time>
                    </Link>
                  </li>
                ))
              ) : (
                <Paragraph className='text-center bg-light-grey py-2.5 rounded-lg'>{`No recent ${getPageTypeLabel(
                  type,
                ).toLowerCase()}s yet`}</Paragraph>
              )}
            </ul>
          </div>
          {data && data.length > 0 ? (
            <div className='text-center'>
              <Link href={`/${type}`} className='link'>
                {`View All ${getPageTypeLabel(type)}s`}
              </Link>
            </div>
          ) : null}
        </div>
      ))}

      {/* Column 3 */}
      <div className='flex flex-col gap-2.5 lg:gap-5'>
        <HallOfFame />
        {guides && <RecentGuides pages={guides} />}
      </div>
    </Container>
  );
}
