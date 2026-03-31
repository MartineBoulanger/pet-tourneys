import Link from 'next/link';
import { FaUpload } from 'react-icons/fa';

export default function PetsAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-wrap items-center justify-center max-w-2xl mx-auto gap-2.5 mb-2.5'>
        <Link
          href='/admin-panel/pets'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          {'Manage All Pets'}
        </Link>
        <Link
          href='/admin-panel/pets/icons'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaUpload className='w-4 h-4' /> <span>{'Upload Pet Icons'}</span>
        </Link>
        <Link
          href='/admin-panel/pets/images'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaUpload className='w-4 h-4' /> <span>{'Upload Pet Images'}</span>
        </Link>
        <Link
          href='/admin-panel/pets/add/bulk'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaUpload className='w-4 h-4' /> <span>{'Upload Pets in Bulk'}</span>
        </Link>
        <Link
          href='/admin-panel/pets/add'
          className='btn-submit flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
        >
          <FaUpload className='w-4 h-4' /> <span>{'Upload a Pet'}</span>
        </Link>
      </div>
      <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
      {children}
    </>
  );
}
