'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import { uploadMultipleImages } from '@/actions/cloudinary/uploadImages';
import { Button, Container, Heading, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';
import { UploadedImage, UploadFormProps } from '@/types/cloudinary.types';
import { toastError, toastSuccess } from '@/utils/toast';

export const UploadForm = ({
  folder = 'pml-images',
  path,
  onUploadSuccess,
}: UploadFormProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('folder', folder);
      images.forEach((img) => {
        formData.append('images', img.file);
      });

      const result = await uploadMultipleImages(formData, path);

      if (result.success) {
        toastSuccess(`Successfully uploaded ${result.count} images!`);
        clearAll();
        onUploadSuccess?.();
      } else {
        toastError('Upload failed: ' + result.error);
      }
    } catch (error) {
      toastError('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container className='max-w-4xl p-0 lg:p-0'>
      <div className='space-y-5'>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 shadow-md',
            isDragging
              ? 'border-humanoid bg-background/80'
              : 'border-light-grey hover:border-blue-grey bg-background',
          )}
        >
          <input
            ref={fileInputRef}
            type='file'
            name='images'
            multiple
            accept='image/*'
            onChange={(e) => handleFiles(e.target.files)}
            className='hidden'
          />
          <FaUpload className='w-8 h-8 mb-4 mx-auto text-foreground/50' />
          <Paragraph className='text-lg font-medium text-foreground/80 mb-2.5'>
            {isDragging
              ? 'Drop images here'
              : 'Click to upload or drag and drop'}
          </Paragraph>
          <Paragraph>{'PNG, JPG, GIF up to max 5MB in total'}</Paragraph>
        </div>

        {images.length > 0 && (
          <div>
            <Heading as='h3'>{`Selected Images (${images.length})`}</Heading>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 md:gap-5'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className='relative group aspect-square rounede-lg overflow-hidden border border-foreground/60 bg-light-grey'
                >
                  {/* using Image from next/image causes errors - therefore using the html element */}
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                  <Button
                    variant='secondary'
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className='absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <FaTrash className='w-3 h-3' />
                  </Button>
                  <div className='absolute bottom-0 left-0 right-0 bg-background/50 text-foreground p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Paragraph className='text-xs truncate'>
                      {image.file.name}
                    </Paragraph>
                    <Paragraph className='text-xs text-foreground/80'>
                      {(image.file.size / 1024).toFixed(1) + 'KB'}
                    </Paragraph>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex gap-2.5'>
          <Button
            type='button'
            onClick={handleUpload}
            disabled={images.length === 0 || uploading}
            className='flex-1 flex items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed'
          >
            {uploading ? (
              <>
                <FiLoader className='h-5 w-5 animate-spin' />
                {`Uploading ${images.length} image${images.length !== 1 ? 's' : ''}`}
              </>
            ) : (
              <>
                <FaImage className='w-5 h-5' />
                {`Upload ${images.length} image${images.length !== 1 ? 's' : ''}`}
              </>
            )}
          </Button>

          {images.length > 0 && !uploading && (
            <Button variant='secondary' type='button' onClick={clearAll}>
              {'Clear All'}
            </Button>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className='mt-5 p-5 bg-background text-foreground rounded-lg'>
          <div className='flex items-center gap-2 text-sm'>
            <FaImage className='h-4 w-4' />
            <span>{`${images.length} image${images.length !== 1 ? 's' : ''} ready to upload
              (${(images.reduce((acc, img) => acc + img.file.size, 0) / 1024 / 1024).toFixed(2)}MB total)`}</span>
          </div>
        </div>
      )}
    </Container>
  );
};
