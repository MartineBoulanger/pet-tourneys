'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaEye, FaSearch, FaTimes, FaTrashAlt } from 'react-icons/fa';
import {
  getImagesAction,
  deleteImageAction,
  searchImagesInFolder,
} from '@/features/cloudinary/actions/cloudinary';
import {
  Button,
  Container,
  Paragraph,
  ImagesManagerSkeleton,
  Input,
} from '@/components/ui';
import { ImageUploadForm } from './UploadForm';
import { CloudinaryImage } from '../types';
import { IoGrid, IoList } from 'react-icons/io5';

export function AdminImagesManager({
  folder = 'pml-images',
}: {
  folder?: string;
}) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState<CloudinaryImage | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);

  const loadImages = async () => {
    setLoading(true);
    const result = await getImagesAction(folder);
    let total = 0;
    if (result.success) {
      total = result.data?.length || 0;
      setImages(result.data as CloudinaryImage[]);
    }
    setTotalImages(total);
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const filterImages = async () => {
    const imagesList = Array.isArray(images) ? images : [];
    if (searchTerm) {
      const filtered = await searchImagesInFolder(searchTerm, folder);
      setFilteredImages(filtered.data);
    } else {
      setFilteredImages(imagesList);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        filterImages();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const toggleImageSelection = (id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = async (publicId: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const result = await deleteImageAction(publicId);
      if (result.success) {
        await loadImages();
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      selectedImages.length > 0 &&
      confirm(`Delete ${selectedImages.length} images?`)
    ) {
      for (const id of selectedImages) {
        await deleteImageAction(id);
      }
      setSelectedImages([]);
      await loadImages();
    }
  };

  const selectAllImages = () => {
    setSelectedImages(filteredImages.map((img) => img.public_id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  if (loading) return <ImagesManagerSkeleton />;

  return (
    <Container className='px-0 lg:px-0'>
      {/* Upload form */}
      <ImageUploadForm onUploadSuccess={loadImages} folder={folder} />

      {/* Search, selecting and viewing layout */}
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

      {/* Images previews */}
      <div className='bg-background rounded-lg shadow-md p-2.5 lg:p-5'>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <Paragraph className='text-lg'>Loading images...</Paragraph>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 lg:gap-5'
                : 'space-y-2.5'
            }
          >
            {(searchTerm ? filteredImages : images).map((image, index) => (
              <div
                key={image.public_id}
                className={`relative bg-light-grey rounded-lg border p-2 ${
                  selectedImages.includes(image.public_id)
                    ? 'ring-2 ring-blue-500'
                    : ''
                }`}
              >
                {/* Checkbox voor selectie */}
                <input
                  type='checkbox'
                  checked={selectedImages.includes(image.public_id)}
                  onChange={() => toggleImageSelection(image.public_id)}
                  className='absolute top-2 left-2 w-4 h-4'
                />

                {/* Image preview */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'aspect-square relative'
                      : 'flex items-center gap-4'
                  }
                >
                  <Image
                    src={image.secure_url}
                    alt={image.public_id}
                    className='w-full h-full object-cover'
                    priority={index === 0}
                    width={viewMode === 'grid' ? image.width : 80}
                    height={viewMode === 'grid' ? image.height : 80}
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
                <div className='grid grid-cols-1 gap-2.5 py-5 border-t border-foreground/30'>
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
                    <Paragraph>
                      <strong className='text-foreground/50'>
                        {'Image URL:'}
                      </strong>{' '}
                      {viewingImage.secure_url}
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
