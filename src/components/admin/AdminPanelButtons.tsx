import Link from 'next/link';
import Image from 'next/image';
import { adminData } from '@/lib/adminData';

export const AdminPanelButtons = () => {
  return (
    <div className='mb-10'>
      <h2 className='text-xl mb-2'>{'What do you want to do?'}</h2>
      <div className='flex items-center gap-5'>
        {adminData.map(({ linkText, imageSrc, id, url }) => (
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
    </div>
  );
};
