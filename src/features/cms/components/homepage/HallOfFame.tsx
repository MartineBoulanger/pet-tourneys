import Image from 'next/image';
import Link from 'next/link';
import { Heading, Paragraph } from '@/components/ui';

export const HallOfFame = async () => {
  // TODO: make it possible to set this data in Supabase instead of hardcoding or MongoDB
  // TODO: change MongoDB to Supabase
  const data = [
    {
      season: 'Pet Masters League Season 3',
      champion: {
        name: 'Woxbc',
        regionFlag: 'https://flagcdn.com/w40/us.png',
        avatar:
          'https://res.cloudinary.com/dubqvghx7/image/upload/v1768081821/pml-images/Woxbc-s3.png',
      },
      runnerUp: {
        name: 'Baldorax',
      },
    },
  ];

  const latest = data[0];

  return (
    <div className='relative rounded-lg bg-gradient-to-br from-background via-light-grey to-background shadow-md flex flex-col justify-between p-2.5 md:p-5'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.15),transparent_60%)]' />
      {/* Champion */}
      <div className='flex items-center gap-2.5 md:gap-5'>
        <div className='relative h-full w-20 shrink-0 overflow-hidden rounded-md'>
          <Image
            src={latest.champion.avatar}
            alt={latest.champion.name}
            fill
            className='object-contain'
          />
        </div>

        <div className='flex-1'>
          <Paragraph className='text-sm uppercase tracking-wider text-foreground'>
            {'Hall of Fame Champion'}
          </Paragraph>
          <Heading as='h2' className='text-3xl font-bold text-humanoid'>
            {latest.champion.name}
          </Heading>
          <div className='mt-2 flex items-center gap-2.5 text-sm text-foreground/50'>
            <Image
              src={latest.champion.regionFlag}
              alt='Region'
              width={28}
              height={28}
            />
            <span>{`Winner of ${latest.season}`}</span>
          </div>
          <Paragraph className='mt-2.5 text-xs text-foreground/80 tracking-wide'>
            {'Runner-up: '}
            <span className='text-dragonkin font-medium uppercase'>
              {latest.runnerUp.name}
            </span>
          </Paragraph>
        </div>
      </div>
      <div className='relative flex justify-end mt-2.5'>
        <Link
          href='/tournaments/hall-of-fame'
          className='btn-submit px-3 py-1.5 rounded-md'
        >
          {'View Full Hall of Fame'}
        </Link>
      </div>
    </div>
  );
};
