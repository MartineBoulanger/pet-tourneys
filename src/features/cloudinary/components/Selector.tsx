// components/ImageSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { getImagesAction } from '@/features/cloudinary/actions/cloudinary';
import { CloudinaryImage } from '../types';

interface ImageSelectorProps {
  onImageSelect?: (image: CloudinaryImage | null) => void;
  onImagesSelect?: (images: CloudinaryImage[] | null) => void;
  selectedImage?: CloudinaryImage | null;
  selectedImages?: CloudinaryImage[] | null;
  folder?: string;
  label?: string;
  showPreview?: boolean;
  required?: boolean;
  multiple?: boolean;
}

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

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (multiple) {
      setTempSelected(selectedImages || []);
    } else {
      setTempSelected(selectedImage ? [selectedImage] : []);
    }
  }, [selectedImage, selectedImages, multiple]);

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

  const handleImageSelect = (image: CloudinaryImage) => {
    if (multiple) {
      // Toggle selection for multiple mode
      const isSelected = tempSelected.some(
        (img) => img.public_id === image.public_id
      );
      if (isSelected) {
        setTempSelected(
          tempSelected.filter((img) => img.public_id !== image.public_id)
        );
      } else {
        setTempSelected([...tempSelected, image]);
      }
    } else {
      // Single selection mode
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
        // Remove specific image
        const newSelection = tempSelected.filter(
          (img) => img.public_id !== imageToRemove.public_id
        );
        onImagesSelect(newSelection.length > 0 ? newSelection : null);
      } else {
        // Remove all images
        onImagesSelect(null);
      }
    } else {
      // Single selection mode
      onImageSelect?.(null);
    }
  };

  const handleRemoveAll = () => {
    if (multiple && onImagesSelect) {
      onImagesSelect(null);
    }
    setTempSelected([]);
  };

  const isSelected = (image: CloudinaryImage) => {
    return tempSelected.some((img) => img.public_id === image.public_id);
  };

  // Determine which images to show in preview based on mode
  const previewImages = multiple
    ? selectedImages || []
    : selectedImage
    ? [selectedImage]
    : [];

  return (
    <div className='relative'>
      <label className='block text-sm font-medium text-gray-700'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      {previewImages.length > 0 && showPreview && (
        <div className='mb-4'>
          <div className='flex flex-wrap gap-2'>
            {previewImages.map((image) => (
              <div key={image.public_id} className='relative'>
                <img
                  src={image.secure_url}
                  alt='Selected'
                  className='w-32 h-32 object-cover rounded border'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(image)}
                  className='absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs'
                  title='Remove this image'
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {multiple && previewImages.length > 1 && (
            <button
              type='button'
              onClick={handleRemoveAll}
              className='mt-2 text-sm text-red-600 hover:text-red-800'
            >
              Remove All
            </button>
          )}
        </div>
      )}

      <button
        type='button'
        onClick={() => setShowSelector(!showSelector)}
        className='bg-gray-100 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200 text-sm'
      >
        {previewImages.length > 0
          ? `${multiple ? 'Change Images' : 'Change Image'}`
          : `${multiple ? 'Select Images' : 'Select Image'}`}
      </button>

      {showSelector && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-96 overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='font-semibold'>
                {multiple ? 'Select Images' : 'Select Image'}
                {multiple &&
                  tempSelected.length > 0 &&
                  ` (${tempSelected.length} selected)`}
              </h3>
              <button
                onClick={() => {
                  setShowSelector(false);
                  setTempSelected(
                    multiple
                      ? selectedImages || []
                      : selectedImage
                      ? [selectedImage]
                      : []
                  );
                }}
                className='text-gray-500 hover:text-gray-700 text-lg'
              >
                ×
              </button>
            </div>

            {loading ? (
              <div>Loading images...</div>
            ) : (
              <>
                <div className='grid grid-cols-3 gap-4 mb-4'>
                  {images.map((image) => (
                    <div
                      key={image.public_id}
                      className={`cursor-pointer border-2 rounded p-1 ${
                        isSelected(image)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-transparent'
                      }`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image.secure_url}
                        alt={image.public_id}
                        className='w-full h-24 object-cover rounded'
                      />
                      <p className='text-xs mt-1 truncate'>
                        {image.public_id.split('/').pop()}
                      </p>
                    </div>
                  ))}
                </div>

                {multiple && (
                  <div className='flex justify-end space-x-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowSelector(false);
                        setTempSelected(selectedImages || []);
                      }}
                      className='px-4 py-2 border border-gray-300 rounded text-sm'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={handleConfirmSelection}
                      className='px-4 py-2 bg-blue-600 text-white rounded text-sm'
                    >
                      Confirm Selection
                    </button>
                  </div>
                )}
              </>
            )}

            {images.length === 0 && !loading && (
              <div className='text-center py-8 text-gray-500'>
                No images found. Upload some images first.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
