'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaEye, FaTimes, FaTrashAlt } from 'react-icons/fa';
import {
  getImagesAction,
  deleteImageAction,
} from '@/features/cloudinary/actions/cloudinary';
import {
  Button,
  Container,
  Paragraph,
  ImagesManagerSkeleton,
} from '@/components/ui';
import { ImageUploadForm } from './UploadForm';
import { CloudinaryImage } from '../types';

export function AdminImagesManager() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<CloudinaryImage | null>(
    null
  );

  const loadImages = async () => {
    setLoading(true);
    const result = await getImagesAction();
    if (result.success) {
      setImages(result.data as CloudinaryImage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleDelete = async (publicId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const result = await deleteImageAction(publicId);
      if (result.success) {
        await loadImages();
      }
    }
  };

  if (loading) return <ImagesManagerSkeleton />;

  return (
    <Container className='px-0 lg:px-0'>
      <ImageUploadForm onUploadSuccess={loadImages} />

      <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <Paragraph className='text-lg'>Loading images...</Paragraph>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'>
            {images.map((image, index) => (
              <div
                key={image.public_id}
                className='relative bg-light-grey group rounded-lg overflow-hidden transition-all'
              >
                <div className='aspect-square relative'>
                  <Image
                    src={image.secure_url}
                    alt={image.public_id}
                    className='w-full h-full object-cover'
                    priority={index === 0}
                    width={image.width}
                    height={image.height}
                    unoptimized
                  />
                </div>
                <div className='p-2.5'>
                  <div className='mb-2.5'>
                    <Paragraph className='text-sm text-foreground/50'>
                      {'Size: '}
                      {(image.bytes / 1024).toFixed(1)}
                      {' KB'}
                    </Paragraph>
                    <Paragraph className='text-sm text-foreground/30'>
                      {'Uploaded: '}
                      {new Date(image.created_at).toLocaleDateString()}
                    </Paragraph>
                  </div>

                  <div className='flex gap-2.5'>
                    <Button
                      onClick={() => setViewingImage(image)}
                      className='flex-1 px-3 py-2 bg-foreground hover:bg-foreground/80 text-background rounded transition-colors flex flex-col items-center text-sm'
                    >
                      <FaEye className='w-5 h-5' />
                      <span>{'View'}</span>
                    </Button>
                    <Button
                      variant='secondary'
                      onClick={() => handleDelete(image.public_id)}
                      className='flex-1 px-3 py-2 transition-colors flex flex-col items-center text-sm'
                      disabled={loading}
                    >
                      <FaTrashAlt className='w-5 h-5' />
                      <span>{'Delete'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {viewingImage && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85'>
          <div className='relative max-w-5xl max-h-[90vh] w-full'>
            {/* Close Button */}
            <Button
              variant='secondary'
              onClick={() => setViewingImage(null)}
              className='absolute top-4 right-4 z-10 p-2.5 rounded-full'
            >
              <FaTimes className='w-5 h-5' />
            </Button>

            {/* Image Container */}
            <div className='bg-light-grey rounded-lg overflow-auto shadow-md max-h-[90vh] flex flex-col'>
              {/* Image */}
              <div className='flex-1 flex items-center justify-center p-2.5 lg:p-5'>
                <Image
                  src={viewingImage.secure_url}
                  alt={viewingImage.public_id}
                  className='max-w-full max-h-full object-contain rounded-lg overflow-hidden'
                  style={{
                    maxHeight: 'calc(90vh - 350px)',
                    width: 'auto',
                    height: 'auto',
                  }}
                  width={viewingImage.width}
                  height={viewingImage.height}
                  unoptimized
                />
              </div>

              {/* Image Info */}
              <div className='px-2.5 lg:px-5 bg-light-grey'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-5 py-5 border-t border-foreground/30'>
                  <div className='space-y-1 text-sm'>
                    <Paragraph className='text-sm'>
                      <strong className='text-foreground/50'>{'Size: '}</strong>
                      {(viewingImage.bytes / 1024).toFixed(1)}
                      {' KB'}
                    </Paragraph>
                    <Paragraph className='text-sm'>
                      <strong className='text-foreground/50'>
                        {'Dimensions:'}
                      </strong>{' '}
                      {viewingImage.width}
                      {' × '}
                      {viewingImage.height}
                      {' pixels'}
                    </Paragraph>
                    <Paragraph>
                      <strong className='text-foreground/50'>
                        {'Image ID:'}
                      </strong>{' '}
                      {viewingImage.public_id}
                    </Paragraph>
                    <Paragraph className='text-sm'>
                      <strong className='text-foreground/50'>
                        {'Uploaded: '}
                      </strong>
                      {new Date(viewingImage.created_at).toLocaleDateString()}
                    </Paragraph>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end items-center gap-2.5 lg:gap-5 py-5 border-t border-foreground/30'>
                  <Button
                    variant='secondary'
                    onClick={() => handleDelete(viewingImage.public_id)}
                    className='flex items-center gap-2'
                    disabled={loading}
                  >
                    <FaTrashAlt className='w-5 h-5' />
                    <span>{'Delete'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
