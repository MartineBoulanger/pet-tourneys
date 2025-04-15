import Link from 'next/link';
import Image from 'next/image';
import { BiLogIn } from 'react-icons/bi';
import { Logout } from '@/components/auth/Logout';
import { getUserSession, getAdminSession } from '@/supabase/actions/auth';

export const TopBar = async () => {
  const user = await getUserSession();
  const admin = await getAdminSession();

  return (
    <div className='flex items-center justify-between bg-medium-grey'>
      <div className='w-full py-2.5 px-5 hidden md:flex md:justify-end md:items-center'>
        {admin ? (
          <>
            <Link
              href='/admin'
              className='btn-link ml-5 rounded-lg py-1 px-1.5 bg-dark-grey hover:bg-blue hover:text-foreground'
            >
              <span className='flex items-center gap-2'>
                <Image
                  src={admin?.admin?.avatar_url || ''}
                  alt={admin?.admin?.username || ''}
                  width={25}
                  height={25}
                  className='rounded-full'
                />
                <span>{admin?.admin?.username}</span>
              </span>
            </Link>
          </>
        ) : null}
        <div className='w-0.5 h-8 bg-blue-grey mx-5 rounded-full' />
        {user ? (
          <Logout />
        ) : (
          <Link href='/login' className='btn-link'>
            <BiLogIn className='h-6 w-6' />
          </Link>
        )}
      </div>
    </div>
  );
};
