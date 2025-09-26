import Link from 'next/link';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { BiLogIn } from 'react-icons/bi';
import { Logout } from '@/features/supabase/components/auth/Logout';
import {
  getUserSession,
  getAdminSession,
} from '@/features/supabase/actions/auth';

export const AdminNav = async () => {
  const user = await getUserSession();
  const admin = await getAdminSession();

  return (
    <div className='w-full py-2.5 px-5 hidden lg:flex lg:items-center'>
      {/* admin panel button */}
      {admin ? (
        <>
          <Link
            href='/admin'
            className='btn-link w-[24px] h-[24px]'
            title='Admin Panel'
            aria-label='Admin Panel'
          >
            <span>
              <Image
                src={admin?.admin?.avatar_url || ''}
                alt={admin?.admin?.username || ''}
                width={24}
                height={24}
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                className='rounded-full'
                loading='lazy'
              />
            </span>
          </Link>
          <div className='w-0.5 h-9 bg-blue-grey mx-5 rounded-full' />
        </>
      ) : null}

      {/* login and logout buttons */}
      {user ? (
        <Logout />
      ) : (
        <Link
          href='/login'
          className='btn-link'
          title='Login'
          aria-label='Login'
        >
          <BiLogIn className='h-6 w-6' />
        </Link>
      )}
      <div className='w-0.5 h-9 bg-blue-grey mx-5 rounded-full' />

      {/* discord button */}
      <Link
        href='http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ'
        className='btn-link flex items-center gap-2.5'
        title='Our Discord Server'
        aria-label='Our Discord Server'
      >
        <span className='hidden lg:block'>{'Discord'}</span>
        <FaDiscord className='w-6 h-6' />
      </Link>
      <div className='w-0.5 h-9 bg-blue-grey ml-5 rounded-full' />
    </div>
  );
};
