import Link from 'next/link';
import Image from 'next/image';
import { Logo } from './Logo';
import { TopBar } from './TopBar';
import { headerData } from '@/lib/headerData';

export async function Header() {
  return (
    <>
      <TopBar />
      <header className='w-full px-5 py-4 sticky top-0 left-0 right-0 bg-background shadow-md z-50'>
        <nav className='flex justify-between items-center'>
          <Logo />
          <div className='hidden md:flex md:shrink-1 items-center gap-x-5'>
            {headerData.map(({ linkText, imageSrc, id, url }) => (
              <Link
                className='btn-link flex items-center gap-2 border py-1 px-3 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
                key={id}
                href={url}
              >
                <span className='max-w-[40px] max-h-[40px]'>
                  <Image
                    src={imageSrc}
                    alt={linkText}
                    width={50}
                    height={50}
                    className='w-full h-full object-cover'
                  />
                </span>
                <span>{linkText}</span>
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
