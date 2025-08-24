import Link from 'next/link';
import Image from 'next/image';
import { BiLogIn } from 'react-icons/bi';
import { cn } from '@/utils/cn';
import { Profile } from '@/types';
import { Logout } from '@/components/auth/Logout';
import { Menu } from './Menu';

interface BottomNavigationProps {
  user?: Profile | null;
}

export const BottomNavigation = ({ user }: BottomNavigationProps) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-background flex items-center justify-evenly lg:hidden z-50'
      )}
    >
      {user ? (
        <Logout className='px-5' />
      ) : (
        <Link
          href='/login'
          className='btn-link p-5'
          title='Login'
          aria-label='Login'
        >
          <BiLogIn className='w-6 h-6' />
        </Link>
      )}

      {user?.role === 'admin' ? (
        <>
          <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />
          <Link
            href='/admin'
            className='btn-link px-5'
            title='Admin Panel'
            aria-label='Admin Panel'
          >
            <span>
              <Image
                src={user?.avatar_url || ''}
                alt={user?.username || ''}
                width={25}
                height={25}
                className='rounded-full'
                loading='lazy'
              />
            </span>
          </Link>
        </>
      ) : null}

      <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />
      <Menu buttonVariant='link' className='lg:hidden' />
    </div>
  );
};
