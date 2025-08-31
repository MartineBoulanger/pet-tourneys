import Link from 'next/link';
import Image from 'next/image';
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
    <div className='w-full py-2.5 px-5 hidden lg:flex lg:justify-end lg:items-center'>
      {admin ? (
        <>
          <Link
            href='/admin'
            className='btn-link w-[25px] h-[25px]'
            title='Admin Panel'
            aria-label='Admin Panel'
          >
            <span>
              <Image
                src={admin?.admin?.avatar_url || ''}
                alt={admin?.admin?.username || ''}
                width={25}
                height={25}
                className='rounded-full'
                loading='lazy'
              />
            </span>
          </Link>
          <div className='w-0.5 h-9 bg-blue-grey mx-5 rounded-full' />
        </>
      ) : null}
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
      <div className='w-0.5 h-9 bg-blue-grey ml-5 rounded-full' />
    </div>
  );
};
