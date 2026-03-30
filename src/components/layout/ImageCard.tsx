'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ImageCardProps } from '@/types/components.types';
import { DownloadImageButton } from './DownloadImageButton';
import { ImageModal } from './ImageModal';

export function ImageCard({ image, isDownloadable = false }: ImageCardProps) {
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
                    publicId={image.public_id}
                    className='backdrop-blur-sm shadow-lg'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isOpen && image && (
        <ImageModal
          image={image}
          setIsOpen={setIsOpen}
          isDownloadable={isDownloadable}
        />
      )}
    </>
  );
}
