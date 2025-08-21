'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FaWindowClose,
  FaSearch,
  FaImage,
  FaTimes,
  FaCheck,
} from 'react-icons/fa';
import { IoGrid, IoList } from 'react-icons/io5';
import { ImageUpload } from '@/mongoDB/types';
import { getUploadedImages } from '@/mongoDB/actions/images';
import { Button, Heading, Input, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';

// Props interface
interface ImageSelectorProps {
  selectedImageId?: string;
  onImageSelect?: (image: ImageUpload | null) => void;
  selectedImageIds?: string[];
  onImagesSelect?: (images: ImageUpload[]) => void;
  multiple?: boolean;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showPreview?: boolean;
  allowNull?: boolean;
  maxSelection?: number;
}

export default function ImageSelector({
  selectedImageId,
  onImageSelect,
  selectedImageIds = [],
  onImagesSelect,
  multiple = false,
  label = 'Select Image',
  placeholder = 'Choose an image...',
  required = false,
  className = '',
  showPreview = true,
  allowNull = true,
  maxSelection,
}: ImageSelectorProps) {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageUpload[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<ImageUpload | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageUpload[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (multiple) {
      // Handle multiple selection
      if (selectedImageIds.length > 0) {
        const selected = images.filter((img) =>
          selectedImageIds.includes(img._id)
        );
        setSelectedImages(selected || []);
      } else {
        setSelectedImages([]);
      }
    } else {
      // Handle single selection
      if (selectedImageId) {
        const image = images.find((img) => img._id === selectedImageId);
        setSelectedImage(image || null);
      } else {
        setSelectedImage(null);
      }
    }
  }, [selectedImageId, selectedImageIds, images, multiple]);

  useEffect(() => {
    // Filter images based on search term
    if (searchTerm) {
      setFilteredImages(
        images.filter((img) =>
          img.alt.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredImages(images);
    }
  }, [images, searchTerm]);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const uploadedImages = await getUploadedImages();
      setImages(uploadedImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (image: ImageUpload) => {
    setSelectedImage(image);
    onImageSelect?.(image);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleMultipleImageToggle = (image: ImageUpload) => {
    const isSelected = selectedImages.some((img) => img._id === image._id);
    let newSelection: ImageUpload[];

    if (isSelected) {
      // Remove from selection
      newSelection = selectedImages.filter((img) => img._id !== image._id);
    } else {
      // Add to selection (check max limit)
      if (maxSelection && selectedImages.length >= maxSelection) {
        // Remove first item and add new one (FIFO)
        newSelection = [...selectedImages.slice(1), image];
      } else {
        newSelection = [...selectedImages, image];
      }
    }

    setSelectedImages(newSelection);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(null);
    onImageSelect?.(null);
  };

  const handleClearMultipleSelection = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedImages([]);
    onImagesSelect?.([]);
  };

  const handleRemoveFromMultipleSelection = (
    e: React.MouseEvent,
    imageId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newSelection = selectedImages.filter((img) => img._id !== imageId);
    setSelectedImages(newSelection);
    onImagesSelect?.(newSelection);
  };

  const handleConfirmMultipleSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImagesSelect?.(selectedImages);
    setIsOpen(false);
    setSearchTerm('');
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
    setSearchTerm('');
  };

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const isImageSelected = (imageId: string) => {
    if (multiple) {
      return selectedImages.some((img) => img._id === imageId);
    } else {
      return selectedImage?._id === imageId;
    }
  };

  const getPlaceholderText = () => {
    if (multiple) {
      if (selectedImages.length === 0) return placeholder;
      if (selectedImages.length === 1) return '1 image selected';
      return `${selectedImages.length} images selected`;
    } else {
      return selectedImage ? selectedImage.alt : placeholder;
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      {label && (
        <label className='block text-sm'>
          {label}
          {required && <span className='text-red ml-1'>{'*'}</span>}
          {multiple && maxSelection && (
            <span className='text-xs ml-2'>
              ({'Max: '}
              {maxSelection})
            </span>
          )}
        </label>
      )}

      {/* Selector Button */}
      <Button
        onClick={openModal}
        className='mb-2.5  w-full px-4 py-2 text-left bg-foreground border border-foreground/50 rounded-lg hover:bg-foreground/30 transition-colors'
      >
        <div className='flex items-center justify-between'>
          <span
            className={
              (multiple ? selectedImages.length > 0 : selectedImage)
                ? 'text-background'
                : 'text-light-grey/50'
            }
          >
            {getPlaceholderText()}
          </span>
          <FaImage className='w-5 h-5 text-light-grey/50' />
        </div>
      </Button>

      {/* Selected Image Preview */}
      {showPreview &&
        ((multiple && selectedImages.length > 0) ||
          (!multiple && selectedImage)) && (
          <div className='p-2.5 rounded-lg bg-light-grey'>
            {multiple ? (
              // Multiple images preview
              <div className='space-y-2.5'>
                <div className='flex items-center justify-between'>
                  <Paragraph className='text-sm font-medium text-humanoid'>
                    {selectedImages.length}
                    {' image'}
                    {selectedImages.length !== 1 ? 's' : ''}
                    {' selected'}
                  </Paragraph>
                  {allowNull && (
                    <Button
                      variant='secondary'
                      onClick={handleClearMultipleSelection}
                      className='p-1.5 text-sm'
                    >
                      {'Clear All'}
                    </Button>
                  )}
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5'>
                  {selectedImages.map((image) => (
                    <div key={image._id} className='relative'>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        className='w-full aspect-square object-cover rounded-lg'
                        width={image.width}
                        height={image.height}
                      />
                      <Button
                        variant='secondary'
                        onClick={(e) =>
                          handleRemoveFromMultipleSelection(e, image._id)
                        }
                        className='absolute p-1 top-1 right-1 rounded-full'
                      >
                        <FaTimes className='w-5 h-5' />
                      </Button>
                      <Paragraph className='flex flex-col absolute bottom-1 left-1 text-foreground bg-background/50 p-1 text-xs truncate'>
                        <span>{image.alt}</span>
                        <span>
                          {image.width}
                          {' × '}
                          {image.height}
                        </span>
                      </Paragraph>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-2.5'>
                <Image
                  src={selectedImage!.src}
                  alt={selectedImage!.alt}
                  className='w-16 h-16 object-cover rounded-lg'
                  width={selectedImage!.width}
                  height={selectedImage!.height}
                />
                <div className='flex-1 min-w-0'>
                  <Paragraph className='text-sm font-medium text-humanoid truncate'>
                    {selectedImage!.alt}
                  </Paragraph>
                  <Paragraph className='text-sm text-foreground/80'>
                    {selectedImage!.width}
                    {' × '}
                    {selectedImage!.height}
                    {' pixels'}
                  </Paragraph>
                  <Paragraph className='text-xs text-foreground/50'>
                    {'ID: '}
                    {selectedImage!._id}
                  </Paragraph>
                </div>
                {allowNull && (
                  <Button
                    variant='secondary'
                    onClick={handleClearSelection}
                    className='p-1 rounded-full'
                  >
                    <FaTimes className='w-5 h-5' />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className='fixed inset-0 z-70 flex items-center justify-center p2.5 lg:p-5 bg-black/85'>
          <div className='bg-light-grey rounded-lg shadow-md w-full max-w-5xl max-h-[90vh] flex flex-col mx-5 lg:mx-0'>
            {/* Modal Header */}
            <div className='flex flex-col lg:flex-row items-center justify-between p-2.5 lg:p-5 border-b border-foreground/80'>
              <div className='text-center lg:text-left mb-2.5 lg:mb-0'>
                <Heading as='h3' className='text-xl font-bold'>
                  {multiple ? 'Select Images' : 'Select an Image'}
                </Heading>
                <div className='text-sm text-foreground/50'>
                  {filteredImages.length}
                  {' image'}
                  {filteredImages.length !== 1 ? 's' : ''}
                  {' available'}
                  {searchTerm && ` (filtered)`}
                  {multiple && (
                    <>
                      {' • '}
                      {selectedImages.length}
                      {' selected'}
                      {maxSelection && ` of ${maxSelection} max`}
                    </>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-2.5 lg:gap-5'>
                {/* Search */}
                <div className='relative'>
                  <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-humanoid w-5 h-5' />
                  <Input
                    id='search'
                    name='search'
                    placeholder='Search images...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10 pr-4 py-2 w-64'
                  />
                </div>

                {/* View Mode Toggle */}
                <Button
                  onClick={() =>
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                  }
                  className='p-2'
                >
                  {viewMode === 'grid' ? (
                    <IoList className='w-5 h-5' />
                  ) : (
                    <IoGrid className='w-5 h-5' />
                  )}
                </Button>

                {/* Close Button */}
                <Button
                  variant='secondary'
                  onClick={closeModal}
                  className='p-2 rounded-full'
                >
                  <FaTimes className='w-5 h-5' />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className='flex-1 overflow-y-auto p-2.5 lg:p-5'>
              {isLoading ? (
                <div className='flex items-center justify-center h-64'>
                  <Paragraph className='text-lg'>Loading images...</Paragraph>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className='text-center py-12'>
                  <FaImage className='w-16 h-16 mx-auto mb-4 text-humanoid' />
                  <Heading
                    as='h3'
                    className='text-lg font-bold text-foreground/50 mb-2.5'
                  >
                    {multiple ? 'No Images Selected' : 'No Image Selected'}
                  </Heading>
                  <Paragraph className='text-foreground/30'>
                    {searchTerm
                      ? 'Try adjusting your search term'
                      : 'No images have been uploaded yet'}
                  </Paragraph>
                </div>
              ) : (
                <>
                  {/* Clear Selection Option */}
                  {allowNull && (
                    <div className='mb-2.5 lg:mb-5'>
                      <Button
                        variant='link'
                        onClick={(e) => {
                          if (multiple) {
                            handleClearMultipleSelection(e);
                          } else {
                            handleClearSelection(e);
                          }
                          closeModal();
                        }}
                        className='w-full p-5 border-2 border-dashed border-foreground/50 rounded-lg text-foreground/50 transition-colors bg-background hover:bg-medium-grey'
                      >
                        <FaWindowClose className='w-8 h-8 mx-auto mb-2.5' />
                        <span>
                          {multiple
                            ? 'No Images Selected'
                            : 'No Image Selected'}
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Images Grid/List */}
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'
                        : 'space-y-2.5 lg:space-y-5'
                    }
                  >
                    {filteredImages.map((image) => {
                      const isSelected = isImageSelected(image._id);
                      const canSelect =
                        !multiple ||
                        !maxSelection ||
                        selectedImages.length < maxSelection ||
                        isSelected;

                      return (
                        <div
                          key={image._id}
                          onClick={() => {
                            if (canSelect) {
                              if (multiple) {
                                handleMultipleImageToggle(image);
                              } else {
                                handleImageSelect(image);
                              }
                            }
                          }}
                          className={cn(
                            'relative cursor-pointer border border-foreground/50 bg-background rounded-lg overflow-hidden transition-all hover:scale-101',
                            selectedImage?._id === image._id
                              ? 'ring-2 ring-humanoid'
                              : 'border-foreground/50',
                            viewMode === 'list'
                              ? 'flex items-center gap-2.5 lg:gap-5 p-2.5 lg:p-5'
                              : ''
                          )}
                        >
                          {/* Selection Indicator */}
                          {isSelected && (
                            <div className='absolute top-2.5 right-2.5 z-10 bg-humanoid text-foreground rounded-full p-1'>
                              <FaCheck className='w-5 h-5' />
                            </div>
                          )}

                          {/* Selection Count for Multiple */}
                          {multiple && isSelected && (
                            <div className='absolute top-2.5 left-2.5 z-10 bg-humanoid text-foreground rounded-full w-7 h-7 flex items-center justify-center font-bold'>
                              {selectedImages.findIndex(
                                (img) => img._id === image._id
                              ) + 1}
                            </div>
                          )}

                          {/* Image */}
                          <div
                            className={
                              viewMode === 'grid'
                                ? 'aspect-square'
                                : 'w-25 h-25 flex-shrink-0 rounded overflow-hidden'
                            }
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              className='w-full h-full object-cover'
                              width={image.width}
                              height={image.height}
                            />
                          </div>

                          {/* Image Info */}
                          <div
                            className={`${
                              viewMode === 'grid' ? 'p-2.5' : 'flex-1 min-w-0'
                            }`}
                          >
                            <Heading
                              as='h3'
                              className='font-bold text-humanoid truncate text-sm'
                            >
                              {image.alt}
                            </Heading>
                            <Paragraph className='text-sm text-foreground/80'>
                              {image.width}
                              {' × '}
                              {image.height}
                              {' pixels'}
                            </Paragraph>
                            <Paragraph className='text-xs text-foreground/50 mt-2.5'>
                              {'ID: '}
                              {image._id}
                            </Paragraph>

                            {/* Usage indicator */}
                            {image.usedIn.length > 0 && (
                              <div className='mt-1'>
                                <span className='inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold border border-dark-green bg-light-green text-dark-green'>
                                  {'Used '}({image.usedIn.length})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer for multiple images selection */}
            {multiple && selectedImages.length > 0 && (
              <div className='flex items-center justify-end p-2.5 lg:p-5 border-t border-foreground/80'>
                <Button onClick={handleConfirmMultipleSelection}>
                  {'Save images'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
