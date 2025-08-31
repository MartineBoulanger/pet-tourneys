import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link title='Home' aria-label='Home' href='/'>
      <span>
        <Image
          width={100}
          height={100}
          className='w-20 h-auto object-cover'
          src={`/images/PML_Logo.png`}
          alt='Logo PML'
          loading='lazy'
          unoptimized
        />
      </span>
    </Link>
  );
};
