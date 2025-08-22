import Link from 'next/link';

export const Logo = () => {
  return (
    <Link title='Logo' aria-label='Logo' href='/'>
      <span>
        <img
          width={40}
          height={40}
          className='w-12 h-12 object-contain'
          src={`${process.env.BASE_URL!}/images/tourney-logo.png`}
          alt='Logo'
          loading='lazy'
        />
      </span>
    </Link>
  );
};
