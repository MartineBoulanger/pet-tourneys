import Link from 'next/link';
import Image from 'next/image';
import { BiLogIn } from 'react-icons/bi';
import { Logout } from '@/components/auth/Logout';
import { getUserSession, getAdminSession } from '@/supabase/actions/auth';

export const AdminNav = async () => {
  const user = await getUserSession();
  const admin = await getAdminSession();

  return (
    <div className='w-full py-2.5 px-5 hidden md:flex md:justify-end md:items-center'>
      {admin ? (
        <>
          <Link
            href='/admin'
            className='btn-link mr-6 flex items-center gap-2 uppercase'
          >
            <Image
              src={admin?.admin?.avatar_url || ''}
              alt={admin?.admin?.username || ''}
              width={25}
              height={25}
              className='rounded-full'
            />
            <span>{admin?.admin?.username}</span>
          </Link>
          <div className='w-0.5 h-9 bg-blue-grey mx-5 rounded-full' />
        </>
      ) : null}
      {user ? (
        <Logout />
      ) : (
        <Link href='/login' className='btn-link'>
          <BiLogIn className='h-6 w-6' />
        </Link>
      )}
      <div className='w-0.5 h-9 bg-blue-grey ml-5 rounded-full' />
    </div>
  );
};
