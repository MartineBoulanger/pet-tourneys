import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Link title='Logo' aria-label='Logo' href='/'>
      <span className='w-full h-10'>
        <Image
          width={40}
          height={40}
          className='w-full h-full object-contain'
          src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`}
          alt='Logo'
          priority
        />
      </span>
    </Link>
  );
};
