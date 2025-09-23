'use client';

import { HTMLProps } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { cn } from '@/utils/cn';

interface DownloadImageButtonProps extends HTMLProps<HTMLElement> {
  publicId: string;
}

export function DownloadImageButton({
  publicId,
  className,
  children,
}: DownloadImageButtonProps) {
  const filename = publicId.split('/')[1] || 'download';
  const downloadUrl = `https://res.cloudinary.com/dubqvghx7/image/upload/fl_attachment:${filename}/${publicId}`;

  return (
    <a
      className={cn(
        `btn-submit inline-flex items-center gap-2 p-2 rounded`,
        className
      )}
      href={downloadUrl}
      download
    >
      {children || <FaFileDownload className='w-5 h-5' />}
    </a>
  );
}
