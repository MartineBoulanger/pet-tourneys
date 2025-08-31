'use client';

import { HTMLProps } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

interface DownloadImageButtonProps extends HTMLProps<HTMLElement> {
  imageUrl: string;
  filename?: string;
}

export function DownloadImageButton({
  imageUrl,
  filename = '',
  className,
  children,
}: DownloadImageButtonProps) {
  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const downloadFilename = filename || imageUrl.split('/').pop() || 'image';
      link.download = downloadFilename;

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Failed downloading image:', error);
    }
  };

  return (
    <Button
      className={cn(`inline-flex items-center gap-2 p-2`, className)}
      onClick={downloadImage}
    >
      {children || <FaFileDownload className='w-5 h-5' />}
    </Button>
  );
}
