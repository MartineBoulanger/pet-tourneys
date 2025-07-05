import Link from 'next/link';

export const Logo = () => {
  return (
    <Link title='Logo' aria-label='Logo' href='/'>
      <span className='w-10 h-10'>
        <img
          width={40}
          height={40}
          className='w-full h-full object-contain'
          src={`${process.env.NEXT_PUBLIC_BASE_URL!}/images/tourney-logo.png`}
          alt='Logo'
          loading='lazy'
        />
      </span>
    </Link>
  );
};
