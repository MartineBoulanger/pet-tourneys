import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { HallOfFameData } from '@/features/supabase/utils/loadJsonData';
import { Heading, Paragraph } from '@/components/ui';

export function HallOfFame({ data }: { data: HallOfFameData }) {
  return (
    <section className='relative py-24 bg-light-grey rounded-lg shadow-md text-center'>
      {/* Center line */}
      <div className='absolute left-1/2 top-2.5 bottom-2.5 w-0.5 bg-humanoid transform -translate-x-1/2 rounded-full' />

      <div className='px-2.5 lg:px-5 flex flex-col gap-24 relative'>
        {data.map((entry, index) => {
          const side = index % 2 === 0 ? 'right' : 'left';
          const align =
            side === 'right' ? 'items-end pr-20' : 'items-start pl-20';
          const connector =
            side === 'right'
              ? 'right-2/3 translate-x-2/3'
              : 'left-2/3 -translate-x-2/3';
          const champion = entry.champion;
          const runnerUp = entry.runnerUp;
          const mostUsedPet = entry.mostUsedPet;

          return (
            <div
              key={`${index}-${entry.season}`}
              className={`relative w-full flex ${align} group transition-all duration-500`}
            >
              {/* Connector line */}
              <div
                className={`absolute top-1/2 ${connector} w-100 h-[2px] bg-humanoid`}
              />

              {/* Card */}
              <div
                className={cn(
                  `relative w-[90%] sm:w-[360px] lg:w-[420px] rounded-lg bg-background p-2.5 lg:p-5 flex flex-col items-center gap-2.5 shadow-md`,
                  side === 'left'
                    ? 'ml-auto origin-right'
                    : 'mr-auto origin-left'
                )}
              >
                <Paragraph className='text-sm uppercase tracking-wide text-foreground/80'>
                  {'Champion'}
                </Paragraph>
                {champion.avatar && (
                  <Image
                    src={champion.avatar}
                    alt={champion.name}
                    width={85}
                    height={85}
                    className='rounded-md overflow-hidden object-contain'
                  />
                )}
                <Heading
                  as='h3'
                  className='text-left leading-none text-humanoid font-brutals font-normal text-xl lg:text-2xl'
                >
                  {champion.name}
                </Heading>
                {champion.guild !== '' && (
                  <Paragraph className='text-xs text-foreground/50'>
                    {champion.guild}
                  </Paragraph>
                )}

                {entry.champion.regionFlag && (
                  <Image
                    src={entry.champion.regionFlag}
                    alt='region flag'
                    width={28}
                    height={28}
                  />
                )}

                {runnerUp?.name && (
                  <Paragraph className='text-sm mt-5 flex flex-col'>
                    <span className='text-foreground/80 uppercase tracking-wide'>
                      {'Runner-Up'}
                    </span>{' '}
                    <span className='font-semibold text-beast'>
                      {runnerUp.name}
                    </span>
                  </Paragraph>
                )}

                {entry.finalsLink && (
                  <Link
                    href={entry.finalsLink}
                    target='_blank'
                    className='btn-submit mt-4 inline-flex items-center justify-center gap-2.5 py-1.5 px-3 rounded-md'
                  >
                    {'Watch the Finals'}
                    <span aria-hidden>{'▶'}</span>
                  </Link>
                )}

                {/* Pet Card */}
                {mostUsedPet?.name ? (
                  <div className={cn('mt-5')}>
                    <div className='flex flex-col items-center'>
                      <Paragraph className='text-sm uppercase tracking-wide text-foreground/80 mb-2.5'>
                        {'Pet Champion'}
                      </Paragraph>
                      {mostUsedPet.image && (
                        <Image
                          src={mostUsedPet.image}
                          alt={mostUsedPet.name || ''}
                          width={65}
                          height={65}
                          className='rounded-md overflow-hidden object-contain'
                        />
                      )}
                      <Heading
                        as='h4'
                        className='text-right text-dragonkin font-brutals font-normal leading-normal text-xl mt-2.5'
                      >
                        {mostUsedPet.name}
                      </Heading>
                    </div>
                  </div>
                ) : null}
              </div>
              {/* Tournament label */}
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-light-grey border border-humanoid px-3 py-1 rounded-lg text-sm shadow-md whitespace-nowrap'>
                {entry.season}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
