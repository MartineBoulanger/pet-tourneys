import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <Link title='Logo PML' aria-label='Logo PML' href='/'>
      <span>
        <Image
          width={50}
          height={50}
          className='w-12 h-12 object-contain'
          src={`/images/PML_Logo.jpg`}
          alt='Logo PML'
          loading='lazy'
          unoptimized
        />
      </span>
    </Link>
  );
};
