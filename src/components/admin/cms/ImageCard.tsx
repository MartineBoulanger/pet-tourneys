'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { ImageUpload } from '@/mongoDB/types';
import { DownloadImageButton } from './DownloadImageButton';

interface ImageCardProps {
  image: ImageUpload;
  isDownloadable?: boolean;
}

export function ImageCard({ image, isDownloadable = false }: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='group relative bg-light-grey rounded-xl overflow-hidden transition-all duration-300 transform'>
        <div className='aspect-square relative overflow-hidden'>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className='object-cover lg:group-hover:scale-110 transition-transform duration-500'
            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
          />

          {/* Hover overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300'>
            <div className='absolute bottom-5 left-5 right-5'>
              <Button
                onClick={() => setIsOpen(true)}
                className='w-full backdrop-blur-sm py-2 px-4'
              >
                {'View Full Image'}
              </Button>
            </div>
            {/* Download button */}
            {isDownloadable && (
              <div className='absolute top-5 right-5'>
                <DownloadImageButton
                  imageUrl={image.src}
                  filename={`${image.alt}.jpg`}
                  className='backdrop-blur-sm shadow-lg'
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='fixed inset-0 z-70 flex items-center justify-center p2.5 lg:p-5 bg-black/85'>
          <div className='bg-light-grey rounded-lg shadow-md max-w-5xl max-h-[90vh] w-full mx-5 lg:mx-0 relative'>
            <Button
              variant='secondary'
              onClick={() => setIsOpen(false)}
              className='p-2 rounded-full absolute top-2.5 lg:top-5 right-2.5 lg:right-5'
            >
              <FaTimes className='w-5 h-5' />
            </Button>
            <div className='flex-1 flex items-center justify-center py-2.5 lg:py-5'>
              <Image
                src={image.src}
                alt={image.alt}
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                }}
                className='w-full h-full object-cover'
                width={image.width}
                height={image.height}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
