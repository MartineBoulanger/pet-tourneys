import Link from 'next/link';
import Image from 'next/image';
import { BiLogIn } from 'react-icons/bi';
import { cn } from '@/utils/cn';
import { BottomNavigationProps } from '@/types';
import { Logout } from '@/components/auth/Logout';
import { Menu } from './Menu';

export const BottomNavigation = ({ user }: BottomNavigationProps) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-background flex items-center justify-evenly md:hidden z-50'
      )}
    >
      {user ? (
        <Logout className='p-5' />
      ) : (
        <Link
          title='Login'
          className='btn-link p-5'
          aria-label='Login'
          href='/login'
        >
          <BiLogIn className='w-6 h-6' />
        </Link>
      )}

      {user?.role === 'admin' ? (
        <>
          <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />
          <Link href='/admin' className='btn-link p-5'>
            <Image
              src={user?.avatar_url || ''}
              alt={user?.username || ''}
              width={25}
              height={25}
              className='rounded-full'
            />
          </Link>
        </>
      ) : null}

      <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />
      <Menu buttonVariant='link' className='md:hidden' />
    </div>
  );
};
