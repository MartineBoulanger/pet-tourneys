import Link from 'next/link';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { BiLogIn } from 'react-icons/bi';
import { cn } from '@/utils/cn';
import { Profile } from '@/features/supabase/types';
import { Logout } from '@/features/supabase/components/auth/Logout';
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
      {/* Admin panel button */}
      {user?.role === 'admin' ? (
        <>
          <Link
            href='/admin'
            className='btn-link px-5 flex justify-center'
            title='Admin Panel'
            aria-label='Admin Panel'
          >
            <span>
              <Image
                src={user?.avatar_url || ''}
                alt={user?.username || ''}
                width={20}
                height={20}
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                className='rounded-full'
                loading='lazy'
              />
            </span>
          </Link>
          <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />
        </>
      ) : null}

      {/* login and logout button */}
      {user ? (
        <Logout className='px-5 flex justify-center' />
      ) : (
        <Link
          href='/login'
          className='btn-link px-5 flex justify-center'
          title='Login'
          aria-label='Login'
        >
          <BiLogIn className='w-6 h-6' />
        </Link>
      )}
      <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />

      {/* Discord button */}
      <Link
        href='http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ'
        className='btn-link px-5 flex justify-center'
        title='Our Discord Server'
        aria-label='Our Discord Server'
      >
        <FaDiscord className='w-6 h-6' />
      </Link>
      <div className='w-0.5 h-10 rounded-lg bg-blue-grey' />

      {/* Menu button */}
      <Menu
        buttonVariant='link'
        className='lg:hidden px-5 flex justify-center'
      />
    </div>
  );
};
