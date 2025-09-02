// components/CloudinaryUploadForm.tsx
'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { Heading, Paragraph, Button } from '@/components/ui';
import { uploadMultipleImagesAction } from '../actions/cloudinary';

interface CloudinaryUploadFormProps {
  folder?: string;
  onUploadSuccess?: () => void;
}

export function ImageUploadForm({
  folder = 'pml-images',
  onUploadSuccess,
}: CloudinaryUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Validate file sizes (max 5MB each)
    const oversizedFiles = newFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setError('Some files exceed the 5MB size limit');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset the file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError('');
    setUploadProgress('Starting upload...');

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });
      formData.append('folder', folder);

      const result = await uploadMultipleImagesAction(formData);

      if (result.success) {
        setUploadProgress(
          `Successfully uploaded ${selectedFiles.length} image(s)!`
        );
        setSelectedFiles([]);
        onUploadSuccess?.();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const calculateTotalSize = () => {
    const totalBytes = selectedFiles.reduce(
      (total, file) => total + file.size,
      0
    );
    return (totalBytes / (1024 * 1024)).toFixed(2);
  };

  return (
    <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5 mb-2.5 lg:mb-5'>
      <Heading as='h3' className='tracking-normal text-lg mb-2.5'>
        {'Upload New Images'}
      </Heading>

      <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-foreground/50 border-dashed rounded-lg cursor-pointer bg-light-grey hover:bg-foreground/30 transition-colors'>
        <div className='flex flex-col items-center justify-center pt-5 pb-5'>
          <FaUpload className='w-8 h-8 mb-4 text-foreground/50' />
          <Paragraph className='mb-2 text-sm text-foreground/50'>
            <span className='font-semibold'>{'Click to upload'}</span>
            {' images'}
          </Paragraph>
          <Paragraph className='text-xs text-foreground/30'>
            {'PNG, JPG, JPEG, GIF, AVIF, WEBP (MAX. 5MB EACH)'}
          </Paragraph>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          multiple
          accept='image/*'
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {error && (
        <div className='mt-5 p-2.5 bg-red-100 border border-red-300 rounded-lg'>
          <Paragraph className='text-red-700 text-sm'>{error}</Paragraph>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className='mt-5 space-y-2.5'>
          <div className='flex justify-between items-center'>
            <Heading as='h4' className='font-medium'>
              {'Selected Files '}({selectedFiles.length})
            </Heading>
            <Paragraph className='text-sm text-foreground/50'>
              Total: {calculateTotalSize()} MB
            </Paragraph>
          </div>

          <div className='max-h-32 overflow-y-auto rounded-lg p-2.5 lg:p-5 bg-light-grey'>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between py-2 border-b first-of-type:border-t border-foreground/30'
              >
                <div className='flex items-center space-x-2 flex-1 min-w-0'>
                  <Paragraph className='text-sm truncate flex-1'>
                    {file.name}
                  </Paragraph>
                  <Paragraph className='text-xs text-foreground/50 whitespace-nowrap'>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Paragraph>
                </div>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => removeFile(index)}
                  className='ml-2.5 text-xs p-1'
                  disabled={isUploading}
                >
                  <FaTrash className='w-3 h-3' />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type='button'
            onClick={handleFileUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className='w-full'
          >
            {isUploading
              ? 'Uploading...'
              : `Upload ${selectedFiles.length} Image(s)`}
          </Button>
        </div>
      )}

      {uploadProgress && (
        <div className='mt-5 p-2.5 bg-blue-100 border border-blue-300 rounded-lg'>
          <Paragraph className='text-blue-700 text-sm'>
            {uploadProgress}
          </Paragraph>
        </div>
      )}
    </div>
  );
}
