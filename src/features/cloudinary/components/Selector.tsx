'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import {
  getImagesAction,
  searchImagesInFolder,
} from '@/features/cloudinary/actions/cloudinary';
import { Button, Heading, Input, Paragraph } from '@/components/ui';
import { CloudinaryImage, ImageSelectorProps } from '../types';

export default function ImageSelector({
  onImageSelect,
  onImagesSelect,
  selectedImage,
  selectedImages = [],
  folder = 'pml-images',
  label = 'Choose image(s)',
  showPreview = true,
  required = false,
  multiple = false,
}: ImageSelectorProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [tempSelected, setTempSelected] = useState<CloudinaryImage[]>(
    multiple ? selectedImages || [] : selectedImage ? [selectedImage] : []
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const result = await getImagesAction(folder);
      if (result.success) {
        setImages(result.data || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      await loadImages();
      return;
    }
    const result = await searchImagesInFolder(term, folder);
    if (result.success) setImages(result.data || []);
  };

  const handleImageSelect = (image: CloudinaryImage) => {
    if (multiple) {
      const isSelected = tempSelected.some(
        (img) => img.public_id === image.public_id
      );
      setTempSelected(
        isSelected
          ? tempSelected.filter((img) => img.public_id !== image.public_id)
          : [...tempSelected, image]
      );
    } else {
      onImageSelect?.(image);
      setShowSelector(false);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple && onImagesSelect) {
      onImagesSelect(tempSelected.length > 0 ? tempSelected : null);
    }
    setShowSelector(false);
  };

  const handleRemoveImage = (imageToRemove?: CloudinaryImage) => {
    if (multiple && onImagesSelect) {
      if (imageToRemove) {
        const newSelection = tempSelected.filter(
          (img) => img.public_id !== imageToRemove.public_id
        );
        onImagesSelect(newSelection.length > 0 ? newSelection : null);
      } else {
        onImagesSelect(null);
      }
    } else {
      onImageSelect?.(null);
    }
  };

  const isSelected = (image: CloudinaryImage) =>
    tempSelected.some((img) => img.public_id === image.public_id);

  const previewImages = multiple
    ? selectedImages || []
    : selectedImage
    ? [selectedImage]
    : [];

  return (
    <div className='relative'>
      <label className='block mb-1'>
        {label}
        {required && <span className='text-red mx-1'>{'*'}</span>}:
      </label>

      {previewImages.length > 0 && showPreview && (
        <div className='mb-5'>
          <div className='flex flex-wrap gap-2.5'>
            {previewImages.map((image) => (
              <div key={image.public_id} className='relative'>
                <Image
                  src={image.secure_url}
                  alt={image.public_id}
                  className='w-32 h-32 object-cover rounded-lg'
                  width={image.width}
                  height={image.height}
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => handleRemoveImage(image)}
                  className='absolute top-0 right-0 rounded-full p-1'
                >
                  <FaTimes className='w-4 h-4' />
                </Button>
              </div>
            ))}
          </div>
          {multiple && previewImages.length > 1 && (
            <Button
              type='button'
              variant='secondary'
              onClick={() => onImagesSelect?.(null)}
              className='mt-2 px-4 py-2.5'
            >
              {'Remove All'}
            </Button>
          )}
        </div>
      )}

      <Button
        type='button'
        variant='link'
        className='border px-4 py-2.5 rounded-md'
        onClick={() => setShowSelector(true)}
      >
        {previewImages.length > 0
          ? `${multiple ? 'Change Images' : 'Change Image'}`
          : `${multiple ? 'Select Images' : 'Select Image'}`}
      </Button>

      {showSelector && (
        <div className='fixed inset-0 bg-background/80 flex items-center justify-center z-[123] px-5'>
          <div className='relative bg-background shadow-md w-full max-w-5xl h-[90vh] flex flex-col rounded-lg overflow-hidden'>
            {/* Header */}
            <div className='flex justify-between items-center p-2.5 lg:p-5 pb-0 lg:pb-0 sticky top-0 bg-light-grey z-20'>
              <Heading as='h2'>
                {multiple ? 'Select Images' : 'Select Image'}
                {multiple &&
                  tempSelected.length > 0 &&
                  ` (${tempSelected.length} selected)`}
              </Heading>
              <Button
                variant='secondary'
                onClick={() => setShowSelector(false)}
                className='rounded-full p-2'
              >
                <FaTimes className='w-4 h-4' />
              </Button>
            </div>

            {/* Search */}
            <div className='px-2.5 lg:p-5 bg-light-grey z-10 shadow-md'>
              <div className='relative'>
                <FaSearch className='absolute left-3 top-2/3 -translate-y-1/2 text-humanoid w-4 h-4' />
                <Input
                  label='Search Images'
                  id='search'
                  name='search'
                  type='search'
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            {/* Scrollable grid */}
            <div className='flex-1 overflow-y-auto p-2.5 lg:p-5 border-x-2 border-x-light-grey'>
              {loading ? (
                <div className='text-center mt-20'>{'Loading images...'}</div>
              ) : images.length === 0 ? (
                <div className='text-center'>{'No images found.'}</div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-5 '>
                  {images.map((image) => (
                    <div
                      key={image.public_id}
                      className={`cursor-pointer rounded-lg overflow-hidden aspect-square relative bg-light-grey hover:scale-101 transition-all ${
                        isSelected(image)
                          ? 'border-2 border-blue-500 '
                          : 'border-transparent'
                      }`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <Image
                        src={image.secure_url}
                        alt={image.public_id}
                        className='w-full h-full object-cover'
                        width={image.width}
                        height={image.height}
                      />
                      <Paragraph className='absolute bottom-0 left-0 w-full p-2.5 truncate z-50 bg-background/70'>
                        {image.public_id.split('/').pop()}
                      </Paragraph>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {multiple && (
              <div className='p-2.5 lg:p-5 sticky bottom-0 bg-light-grey'>
                <div className='flex justify-end gap-2.5'>
                  <Button
                    variant='secondary'
                    onClick={() => {
                      setShowSelector(false);
                      setTempSelected(selectedImages || []);
                    }}
                  >
                    {'Cancel'}
                  </Button>
                  <Button onClick={handleConfirmSelection}>{'Confirm'}</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
