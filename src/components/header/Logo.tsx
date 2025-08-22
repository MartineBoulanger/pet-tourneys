import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link title='Logo' aria-label='Logo' href='/'>
      <span>
        <Image
          width={40}
          height={40}
          className='w-12 h-12 object-contain'
          src={`/images/tourney-logo.png`}
          alt='Logo'
          loading='lazy'
          unoptimized
        />
      </span>
    </Link>
  );
};
