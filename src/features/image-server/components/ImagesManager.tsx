'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FaEye,
  FaUpload,
  FaTrashAlt,
  FaEdit,
  FaSearch,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { IoGrid, IoList } from 'react-icons/io5';
import {
  Button,
  Checkbox,
  Container,
  Heading,
  ImagesManagerSkeleton,
  Input,
  Paragraph,
} from '@/components/ui';
import { cn } from '@/utils/cn';
import { ImageRecord } from '../types';
import { listImages } from '../actions/getImages';
import { uploadMultipleImages } from '../actions/uploadImages';
import { updateImage } from '../actions/updateImage';
import { deleteImage } from '../actions/deleteImages';

interface ImagesManagerProps {
  initialImages?: ImageRecord[] | undefined;
}

export function ImagesManager({ initialImages = [] }: ImagesManagerProps) {
  const [images, setImages] = useState<ImageRecord[]>(initialImages || []);
  const [filteredImages, setFilteredImages] = useState<ImageRecord[]>(
    initialImages || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editAlt, setEditAlt] = useState<string>('');
  const [editTags, setEditTags] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewingImage, setViewingImage] = useState<ImageRecord | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!initialImages.length) {
      loadImages();
    }
  }, []);

  // Handle search term changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        loadImages(1, searchTerm);
      } else {
        filterImages();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    filterImages();
  }, [images]);

  const loadMoreImages = async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadImages(nextPage, searchTerm);
  };

  const showLessImages = () => {
    // Reset to first page
    setCurrentPage(1);
    loadImages(1, searchTerm);
  };

  const loadImages = async (page: number = 1, search: string = '') => {
    if (page === 1) {
      setIsLoading(true);
      setImages([]); // Clear existing images when starting fresh
    } else {
      setIsLoadingMore(true);
    }

    try {
      const result = await listImages(page, search);

      // Process the response
      const newImages: ImageRecord[] =
        result.items?.map((item: ImageRecord) => ({
          ...item,
          width:
            typeof item.width === 'string'
              ? parseInt(item.width, 10)
              : item.width,
          height:
            typeof item.height === 'string'
              ? parseInt(item.height, 10)
              : item.height,
        })) || [];

      if (page === 1) {
        // First page - replace all images
        setImages(newImages);
        setCurrentPage(1);
      } else {
        // Additional pages - append to existing images
        setImages((prev) => [...prev, ...newImages]);
        setCurrentPage(page);
      }

      setTotalImages(result.total || 0);
    } catch (error) {
      console.error('ImageSelector - Error loading images:', error);
      if (page === 1) {
        setImages([]);
        setTotalImages(0);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const filterImages = () => {
    // Ensure images is always an array
    const imagesList = Array.isArray(images) ? images : [];
    if (searchTerm) {
      const filtered = imagesList.filter(
        (img) =>
          img.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          img.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(imagesList);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${selectedFiles.length} file(s)...`);

    try {
      const { results, errors } = await uploadMultipleImages(selectedFiles, {});

      if (errors.length > 0) {
        setUploadProgress(
          `Uploaded ${results.length}/${selectedFiles.length} images. Some failed.`
        );
      } else {
        setUploadProgress(`Successfully uploaded ${results.length} image(s)`);
      }

      // Add new images to the list
      setImages((prev) => [...results, ...prev]);
      setSelectedFiles([]);

      // Clear file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setTimeout(() => setUploadProgress(''), 3000);
      router.refresh();
    } catch (error) {
      console.error(error);
      setUploadProgress('Upload failed');
      setTimeout(() => setUploadProgress(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      startTransition(async () => {
        try {
          await deleteImage(imageId);
          setImages((prev) => prev.filter((img) => img.id !== imageId));
          setSelectedImages((prev) => prev.filter((id) => id !== imageId));
          router.refresh();
        } catch (error) {
          alert('Failed to delete image');
          console.error(error);
        }
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedImages.length} image(s)?`
      )
    ) {
      startTransition(async () => {
        try {
          const deletePromises = selectedImages.map((id) => deleteImage(id));
          await Promise.all(deletePromises);

          setImages((prev) =>
            prev.filter((img) => !selectedImages.includes(img.id))
          );
          setSelectedImages([]);
          router.refresh();
        } catch (error) {
          alert('Some images failed to delete');
          console.error(error);
        }
      });
    }
  };

  const handleEditImage = (image: ImageRecord) => {
    setEditingImage(image.id);
    setEditTitle(image.title);
    setEditAlt(image.alt);
    setEditTags(image.tags.join(', '));
  };

  const handleSaveEdit = async (imageId: string) => {
    startTransition(async () => {
      try {
        const tags = editTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        const updated = await updateImage(imageId, {
          title: editTitle,
          alt: editAlt,
          tags,
        });

        setImages((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, ...updated } : img))
        );
        setEditingImage(null);
        router.refresh();
      } catch (error) {
        alert('Failed to update image');
        console.error(error);
      }
    });
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    setSelectedImages(filteredImages.map((img) => img.id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  if (isLoading && !images.length) return <ImagesManagerSkeleton />;

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
              {'PNG, JPG, JPEG, GIF, AVIF, WEBP (MAX. 5MB TOTAL)'}
            </Paragraph>
          </div>

          <input
            type='file'
            className='hidden'
            multiple
            accept='image/*'
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {selectedFiles.length > 0 && (
          <div className='mt-5 space-y-2.5'>
            <Heading as='h4' className='font-medium'>
              {'Selected Files '}({selectedFiles.length})
            </Heading>

            <div className='max-h-32 overflow-y-auto rounded-lg p-2.5 lg:p-5 bg-light-grey'>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-2 border-b first-of-type:border-t border-foreground/30'
                >
                  <Paragraph className='text-sm truncate'>
                    {file.name}
                  </Paragraph>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => removeFile(index)}
                    className='ml-2.5 text-xs'
                  >
                    {'Remove'}
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type='button'
              onClick={handleFileUpload}
              disabled={isUploading}
              className='w-full'
            >
              {isUploading
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} Image(s)`}
            </Button>
          </div>
        )}

        {uploadProgress && (
          <div className='mt-5 p-2.5 bg-light-grey rounded-lg'>
            <Paragraph>{uploadProgress}</Paragraph>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5 mb-2.5 lg:mb-5'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-5'>
          {/* Search */}
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

        {(searchTerm ? filteredImages.length : images.length) > 0 && (
          <div className='mt-2.5 lg:mt-5 flex items-center gap-2.5 lg:gap-5'>
            <span className='text-sm text-foreground/50'>
              {searchTerm
                ? `Showing ${filteredImages.length} of ${totalImages} images`
                : `Showing ${images.length} of ${totalImages} images`}
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
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <Paragraph className='text-lg'>Loading images...</Paragraph>
          </div>
        ) : !Array.isArray(filteredImages) || filteredImages.length === 0 ? (
          <div className='text-center py-10'>
            <FaUpload className='w-16 h-16 mx-auto mb-5 text-foreground/50' />
            <Heading
              as='h3'
              className='text-lg font-bold text-foreground/30 mb-2.5'
            >
              {'No images found'}
            </Heading>
            <Paragraph className='text-foreground/50'>
              {searchTerm
                ? 'Try adjusting your search term'
                : 'Upload some images to get started'}
            </Paragraph>
          </div>
        ) : (
          <>
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'
                  : 'space-y-2.5 lg:space-y-5'
              )}
            >
              {Array.isArray(filteredImages) &&
                filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={cn(
                      'relative bg-light-grey group border border-foreground/30 rounded-lg overflow-hidden transition-all',
                      selectedImages.includes(image.id)
                        ? 'ring-2 ring-humanoid'
                        : 'hover:scale-101',
                      viewMode === 'list'
                        ? 'flex items-center gap-2.5 p-2.5'
                        : ''
                    )}
                  >
                    {/* Selection Checkbox */}
                    <div className='absolute top-2.5 left-2.5 z-10'>
                      <Checkbox
                        id={image.id}
                        name={image.id}
                        checked={selectedImages.includes(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                        className='w-5 h-5 text-humanoid rounded-lg'
                      />
                    </div>

                    {image.tags.length > 0 && (
                      <div className='absolute top-2.5 right-2.5 z-10 flex flex-wrap items-center gap-1.5'>
                        {image.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className='px-1.5 py-0.5 text-xs bg-background rounded'
                          >
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 2 && (
                          <span className='text-xs text-foreground/50'>
                            +{image.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Image */}
                    <div
                      className={cn(
                        viewMode === 'grid'
                          ? 'aspect-square relative'
                          : 'w-25 h-25 flex-shrink-0 rounded overflow-hidden'
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        className='w-full h-full object-cover'
                        width={Number(image.width)}
                        height={Number(image.height)}
                        priority={index === 0}
                      />
                    </div>

                    {/* Image Info */}
                    <div
                      className={cn(
                        viewMode === 'grid' ? 'p-2.5' : 'flex-1 min-w-0'
                      )}
                    >
                      {editingImage === image.id ? (
                        <div className='flex flex-col items-start gap-1 mb-2.5'>
                          <Input
                            id={editTitle}
                            name={editTitle}
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleSaveEdit(image.id)
                            }
                            autoFocus
                          />
                          <Input
                            id={editAlt}
                            name={editAlt}
                            value={editAlt}
                            onChange={(e) => setEditAlt(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleSaveEdit(image.id)
                            }
                          />
                          <Input
                            id={editTags}
                            name={editTags}
                            placeholder='Tags (comma separated)'
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleSaveEdit(image.id)
                            }
                          />
                          <div className='flex gap-1'>
                            <Button
                              variant='link'
                              onClick={() => handleSaveEdit(image.id)}
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
                        </div>
                      ) : (
                        <div className='mb-2.5'>
                          <Heading
                            as='h3'
                            className='font-bold text-humanoid truncate'
                          >
                            {image.title}
                          </Heading>
                          <Paragraph className='text-sm text-foreground/30 truncate'>
                            {image.alt}
                          </Paragraph>
                          <Paragraph className='text-sm text-foreground/30'>
                            {image.width}
                            {' × '}
                            {image.height}
                            {' pixels'}
                          </Paragraph>
                          <Paragraph className='text-xs text-foreground/50 mb-3'>
                            {'ID: '}
                            {image.id.slice(0, 8)}
                            {'...'}
                          </Paragraph>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className='flex gap-1'>
                        <Button
                          onClick={() => setViewingImage(image)}
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
                          onClick={() => handleEditImage(image)}
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
                          onClick={() => handleDeleteImage(image.id)}
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
            {/* Load More / Show Less Buttons */}
            {images.length > 0 && !searchTerm && (
              <div className='flex items-center justify-center gap-2.5 mt-5 pt-5 border-t border-foreground/30'>
                <Button
                  onClick={loadMoreImages}
                  disabled={isLoadingMore}
                  className='px-6 py-2'
                >
                  {isLoadingMore
                    ? 'Loading...'
                    : `Load More (${totalImages - images.length} remaining)`}
                </Button>

                {currentPage > 1 && (
                  <Button
                    variant='secondary'
                    onClick={showLessImages}
                    className='px-6 py-2'
                  >
                    Show Less
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Image Viewer Modal */}
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
              <div className='flex-1 flex items-center justify-center pt-2.5 lg:pt-5'>
                <Image
                  src={viewingImage.url}
                  alt={viewingImage.alt}
                  className='max-w-full max-h-full object-contain'
                  style={{
                    maxHeight: 'calc(90vh - 350px)',
                    width: 'auto',
                    height: 'auto',
                  }}
                  width={Number(viewingImage.width)}
                  height={Number(viewingImage.height)}
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
                        {viewingImage.id}
                      </Paragraph>
                      {viewingImage.tags.length > 0 ? (
                        <Paragraph>
                          <strong className='text-foreground/50'>
                            {'Tags:'}
                          </strong>{' '}
                          {viewingImage.tags.join(', ')}
                        </Paragraph>
                      ) : null}
                      <Paragraph>
                        <strong className='text-foreground/50'>
                          {'Uploaded:'}
                        </strong>{' '}
                        {new Date(viewingImage.uploadedAt).toLocaleDateString()}
                      </Paragraph>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex justify-end items-center gap-2.5 lg:gap-5 mt-5 pt-5 border-t border-foreground/30'>
                  <Button
                    onClick={() => {
                      handleEditImage(viewingImage);
                      setViewingImage(null);
                    }}
                    className='flex items-center gap-2'
                  >
                    <FaEdit className='w-5 h-5' />
                    <span>{'Edit'}</span>
                  </Button>

                  <Button
                    variant='secondary'
                    onClick={() => {
                      handleDeleteImage(viewingImage.id);
                      setViewingImage(null);
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
}
