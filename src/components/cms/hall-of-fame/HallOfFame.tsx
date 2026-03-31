import Image from 'next/image';
import Link from 'next/link';
import { Heading, Paragraph } from '@/components/ui';
import { getLatestHalloffame } from '@/actions/supabase/cms-schema/halloffame/getHalloffame';
import { FLAGS } from '@/types/supabase.types';

export const HallOfFame = async () => {
  const { data: latest } = await getLatestHalloffame();

  return (
    <div className='relative rounded-lg bg-gradient-to-br from-background via-light-grey to-background shadow-md flex flex-col justify-between p-2.5 md:p-5'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.15),transparent_60%)]' />
      {/* Champion */}
      <div className='flex items-center gap-2.5 md:gap-5'>
        {latest?.avatar ? (
          <div className='relative h-full w-20 shrink-0 overflow-hidden rounded-md'>
            <Image
              src={latest.avatar?.secure_url}
              alt={latest.champion}
              fill
              className='object-contain'
            />
          </div>
        ) : null}

        <div className='flex-1'>
          <Paragraph className='text-sm uppercase tracking-wider text-foreground'>
            {'Hall of Fame Champion'}
          </Paragraph>
          <Heading as='h2' className='text-3xl text-humanoid'>
            {latest?.champion}
          </Heading>
          <div className='mt-2 flex items-center gap-2.5 text-sm text-foreground/50'>
            {latest?.region ? (
              <Image
                src={`https://flagcdn.com/w40/${FLAGS[latest.region]}.png`}
                alt='Region'
                width={28}
                height={28}
              />
            ) : null}
            <span>{`Winner of ${latest?.season}`}</span>
          </div>
          <Paragraph className='mt-2.5 text-xs text-foreground/80 tracking-wide'>
            {'Runner-up: '}
            <span className='text-dragonkin font-medium uppercase'>
              {latest?.runnerup}
            </span>
          </Paragraph>
        </div>
      </div>
      <div className='relative flex justify-end mt-2.5'>
        <Link
          href='/leagues/hall-of-fame'
          className='btn-submit px-3 py-1.5 rounded-md'
        >
          {'View Full Hall of Fame'}
        </Link>
      </div>
    </div>
  );
};
