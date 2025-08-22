'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  FaEye,
  FaUpload,
  FaTrashAlt,
  FaEdit,
  FaSearch,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { IoGrid, IoList, IoAlertCircle } from 'react-icons/io5';
import {
  uploadImages,
  getUploadedImages,
  deleteImage,
  updateImage,
} from '@/mongoDB/actions/images';
import { ImageUpload } from '@/mongoDB/types';
import {
  Container,
  Heading,
  Paragraph,
  Select,
  Option,
  Input,
  Button,
  Checkbox,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import { ImageManagerSkeleton } from '@/components/ui';

export const ImageUploader = () => {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUsage, setFilterUsage] = useState<'all' | 'used' | 'unused'>(
    'all'
  );
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewingImage, setViewingImage] = useState<ImageUpload | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm, filterUsage]);

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

  const filterImages = () => {
    let filtered = images;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (img) =>
          img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${files.length} file(s)...`);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const result = await uploadImages(formData);
      if (result.success && result.images) {
        setImages((prev) => [...result.images!, ...prev]);
        setUploadProgress(
          `Successfully uploaded ${result.images.length} image(s)`
        );
        setTimeout(() => setUploadProgress(''), 3000);
      } else {
        setUploadProgress(result.error || 'Upload failed');
        setTimeout(() => setUploadProgress(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setUploadProgress('Upload failed');
      setTimeout(() => setUploadProgress(''), 3000);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      startTransition(async () => {
        const result = await deleteImage(imageId);
        if (result.success) {
          setImages((prev) => prev.filter((img) => img._id !== imageId));
          setSelectedImages((prev) => prev.filter((id) => id !== imageId));
        } else {
          alert(result.error || 'Failed to delete image');
        }
      });
    }
  };

  const handleBulkDelete = async () => {
    const usedImages = selectedImages.filter((id) => {
      const img = images.find((i) => i._id === id);
      return img;
    });

    let confirmMessage = `Are you sure you want to delete ${selectedImages.length} image(s)?`;
    if (usedImages.length > 0) {
      confirmMessage += ` ${usedImages.length} of them are currently being used.`;
    }

    if (confirm(confirmMessage)) {
      startTransition(async () => {
        const deletePromises = selectedImages.map((id) => deleteImage(id));
        const results = await Promise.all(deletePromises);

        const successful = results.filter((r) => r.success).length;
        setImages((prev) =>
          prev.filter((img) => !selectedImages.includes(img._id))
        );
        setSelectedImages([]);

        alert(
          `Successfully deleted ${successful} out of ${selectedImages.length} images`
        );
      });
    }
  };

  const handleEditAlt = (image: ImageUpload) => {
    setEditingImage(image._id);
    setEditAlt(image.alt);
  };

  const handleSaveAlt = async (imageId: string) => {
    startTransition(async () => {
      const result = await updateImage(imageId, { alt: editAlt });
      if (result.success) {
        setImages((prev) =>
          prev.map((img) =>
            img._id === imageId ? { ...img, alt: editAlt } : img
          )
        );
        setEditingImage(null);
      } else {
        alert(result.error || 'Failed to update image');
      }
    });
  };

  const handleViewImage = (image: ImageUpload) => {
    setViewingImage(image);
  };

  const handleCloseImageViewer = () => {
    setViewingImage(null);
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    setSelectedImages(filteredImages.map((img) => img._id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  if (isLoading) return <ImageManagerSkeleton />;

  return (
    <Container className='px-0 lg:px-0'>
      {/* Upload Section */}
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
              {'PNG, JPG, JPEG (MAX. 5MB TOTAL)'}
            </Paragraph>
          </div>
          <input
            type='file'
            className='hidden'
            multiple
            accept='image/*'
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>

        {uploadProgress && (
          <div className='mt-5 p-2.5 bg-light-grey rounded-lg'>
            <Paragraph>{uploadProgress}</Paragraph>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5 mb-2.5 lg:mb-5'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-5'>
          {/* Search and Filter */}
          <div className='flex flex-col sm:flex-row gap-2.5 lg:gap-5 flex-1'>
            <div className='relative'>
              <FaSearch className='absolute left-3 top-2/3 transform -translate-y-1/2 text-humanoid w-4 h-4' />
              <Input
                label='Search images'
                name='search'
                id='search'
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>

            <Select
              label='Sort by Usage'
              name='filterUsage'
              id='filterUsage'
              value={filterUsage}
              onChange={(e) =>
                setFilterUsage(e.target.value as 'all' | 'used' | 'unused')
              }
            >
              <Option value='all' label='All Images' />
              <Option value='used' label='Used Images' />
              <Option value='unused' label='Unused Images' />
            </Select>
          </div>

          {/* View Mode and Bulk Actions */}
          <div className='flex flex-wrap items-center gap-2.5'>
            {selectedImages.length > 0 && (
              <>
                <span className='text-sm text-foreground/50'>
                  {selectedImages.length}
                  {' image(s) selected'}
                </span>
                <Button
                  onClick={handleBulkDelete}
                  variant='secondary'
                  className='px-3 py-2.5'
                  disabled={isPending}
                >
                  {'Delete Selected'}
                </Button>
                <Button
                  onClick={clearSelection}
                  variant='link'
                  className='px-3 py-2.5 border'
                >
                  {'Clear Selection'}
                </Button>
              </>
            )}

            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className='p-2.5'
              title='Toggle View Mode'
              aria-label='Toggle View Mode'
            >
              {viewMode === 'grid' ? (
                <IoList className='w-5 h-5' />
              ) : (
                <IoGrid className='w-5 h-5' />
              )}
            </Button>
          </div>
        </div>

        {filteredImages.length > 0 && (
          <div className='mt-2.5 lg:mt-5 flex items-center gap-2.5 lg:gap-5'>
            <span className='text-sm text-foreground/50'>
              {`Showing ${filteredImages.length} of ${images.length} images`}
            </span>
            <Button
              onClick={selectAllImages}
              variant='link'
              className='text-sm border-b-2 rounded-none'
            >
              {'Select All Visible'}
            </Button>
          </div>
        )}
      </div>

      {/* Images Grid/List */}
      <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
        {filteredImages.length === 0 ? (
          <div className='text-center py-10'>
            <FaUpload className='w-16 h-16 mx-auto mb-5 text-foreground/50' />
            <Heading
              as='h3'
              className='text-lg font-bold text-foreground/30 mb-2.5'
            >
              {'No images found'}
            </Heading>
            <Paragraph className='text-foreground/50'>
              {searchTerm || filterUsage !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Upload some images to get started'}
            </Paragraph>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'
                : 'space-y-2.5 lg:space-y-5'
            )}
          >
            {filteredImages.map((image) => (
              <div
                key={image._id}
                className={cn(
                  'relative bg-light-grey group border border-foreground/30 rounded-lg overflow-hidden transition-all',
                  selectedImages.includes(image._id)
                    ? 'ring-2 ring-humanoid'
                    : 'hover:scale-101',
                  viewMode === 'list' ? 'flex items-center gap-2.5 p-2.5' : ''
                )}
              >
                {/* Selection Checkbox */}
                <div className='absolute top-2.5 left-2.5 z-10'>
                  <Checkbox
                    id={image._id}
                    name={image._id}
                    checked={selectedImages.includes(image._id)}
                    onChange={() => toggleImageSelection(image._id)}
                    className='w-5 h-5 text-humanoid rounded-lg'
                  />
                </div>

                {/* Image */}
                <div
                  className={cn(
                    viewMode === 'grid'
                      ? 'aspect-square relative'
                      : 'w-25 h-25 flex-shrink-0 rounded overflow-hidden'
                  )}
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
                  className={cn(
                    viewMode === 'grid' ? 'p-2.5' : 'flex-1 min-w-0'
                  )}
                >
                  {editingImage === image._id ? (
                    <div className='flex items-center mb-2.5'>
                      <Input
                        id={editAlt}
                        name={editAlt}
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleSaveAlt(image._id)
                        }
                        autoFocus
                      />
                      <Button
                        variant='link'
                        onClick={() => handleSaveAlt(image._id)}
                        className='text-green hover:text-dark-green px-2.5'
                        disabled={isPending}
                      >
                        <FaCheck className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='link'
                        onClick={() => setEditingImage(null)}
                        className='text-red hover:text-dark-red pr-2.5'
                      >
                        <FaTimes className='w-5 h-5' />
                      </Button>
                    </div>
                  ) : (
                    <div className='mb-2.5'>
                      <Heading
                        as='h3'
                        className='font-bold text-humanoid truncate'
                      >
                        {image.alt}
                      </Heading>
                      <Paragraph className='text-sm text-foreground/30'>
                        {image.width}
                        {' × '}
                        {image.height}
                        {' pixels'}
                      </Paragraph>
                    </div>
                  )}

                  <Paragraph className='text-xs text-foreground/50 mb-3'>
                    {'ID: '}
                    {image._id}
                  </Paragraph>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap gap-2.5'>
                    <Button
                      onClick={() => handleViewImage(image)}
                      className={cn(
                        'flex-1 px-3 py-2 bg-foreground hover:bg-foreground/80 text-background rounded transition-colors',
                        viewMode === 'grid'
                          ? 'flex flex-col items-center text-sm'
                          : 'flex justify-center gap-2'
                      )}
                    >
                      <FaEye className='w-5 h-5' />
                      <span>{'View'}</span>
                    </Button>

                    <Button
                      onClick={() => handleEditAlt(image)}
                      className={cn(
                        'flex-1 px-3 py-2 transition-colors',
                        viewMode === 'grid'
                          ? 'flex flex-col items-center text-sm'
                          : 'flex justify-center gap-2'
                      )}
                    >
                      <FaEdit className='w-5 h-5' />
                      <span>{'Edit'}</span>
                    </Button>

                    <Button
                      variant='secondary'
                      onClick={() => handleDeleteImage(image._id)}
                      className={cn(
                        'flex-1 px-3 py-2 transition-colors',
                        viewMode === 'grid'
                          ? 'flex flex-col items-center text-sm'
                          : 'flex justify-center gap-2'
                      )}
                      disabled={isPending}
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
              onClick={handleCloseImageViewer}
              className='absolute top-4 right-4 z-10 p-2.5 rounded-full'
            >
              <FaTimes className='w-5 h-5' />
            </Button>

            {/* Image Container */}
            <div className='bg-light-grey rounded-lg overflow-auto shadow-md max-h-[90vh] flex flex-col'>
              {/* Image */}
              <div className='flex-1 flex items-center justify-center pt-2.5 lg:pt-5'>
                <Image
                  src={viewingImage.src}
                  alt={viewingImage.alt}
                  className='max-w-full max-h-full object-contain'
                  style={{
                    maxHeight: 'calc(90vh - 350px)',
                    width: 'auto',
                    height: 'auto',
                  }}
                  width={viewingImage.width || 500}
                  height={viewingImage.height || 500}
                />
              </div>

              {/* Image Info */}
              <div className='p-2.5 lg:p-5 bg-light-grey'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2.5 lg:gap-5 pt-5 border-t border-foreground/30'>
                  <div>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid mb-2.5'
                    >
                      {viewingImage.alt}
                    </Heading>
                    <div className='space-y-1 text-sm'>
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
                        {viewingImage._id}
                      </Paragraph>
                      <Paragraph>
                        <strong className='text-foreground/50'>
                          {'Uploaded:'}
                        </strong>{' '}
                        {new Date(viewingImage.createdAt).toLocaleDateString()}
                      </Paragraph>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end items-center gap-2.5 lg:gap-5 mt-5 pt-5 border-t border-foreground/30'>
                  <Button
                    onClick={() => {
                      handleEditAlt(viewingImage);
                      handleCloseImageViewer();
                    }}
                    className='flex items-center gap-2'
                  >
                    <FaEdit className='w-5 h-5' />
                    <span>{'Edit'}</span>
                  </Button>

                  <Button
                    variant='secondary'
                    onClick={() => {
                      handleDeleteImage(viewingImage._id);
                      handleCloseImageViewer();
                    }}
                    className='flex items-center gap-2'
                    disabled={isPending}
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
};
