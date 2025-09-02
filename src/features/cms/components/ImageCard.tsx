'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { CloudinaryImage } from '@/features/cloudinary/types';

interface ImageCardProps {
  image?: CloudinaryImage | null;
}

export function ImageCard({ image }: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {image && (
        <div className='group relative bg-light-grey rounded-xl overflow-hidden transition-all duration-300 transform'>
          <div className='aspect-square relative overflow-hidden'>
            <Image
              src={image.secure_url}
              alt={image.public_id}
              fill
              className='object-cover lg:group-hover:scale-110 transition-transform duration-500'
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
              unoptimized
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
              {/* {isDownloadable && (
              <div className='absolute top-5 right-5'>
                <DownloadImageButton
                  imageUrl={image.url}
                  filename={image.filename}
                  className='backdrop-blur-sm shadow-lg'
                />
              </div>
            )} */}
            </div>
          </div>
        </div>
      )}
      {isOpen && image && (
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
                src={image.secure_url}
                alt={image.public_id}
                style={{
                  maxHeight: 'calc(90vh - 350px)',
                  width: 'auto',
                  height: 'auto',
                }}
                className='w-full h-full object-cover'
                width={image.width}
                height={image.height}
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
