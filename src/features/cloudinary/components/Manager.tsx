'use client';

import { useState } from 'react';
import { ImageUploadForm } from './UploadForm';
import { ImagesToolbar } from './Toolbar';
import { ImagesGrid } from './Grid';
import { ImageModal } from './Modal';
import { CloudinaryImage, ImagesManagerProps } from '../types';
import { deleteImageAction, getImagesAction } from '../actions/cloudinary';
import { Button } from '@/components/ui';

export function ImagesManager({
  folder,
  initImages,
  nextCursor: initialCursor,
  path,
}: ImagesManagerProps) {
  const [images, setImages] = useState<CloudinaryImage[]>(
    () => initImages ?? []
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialCursor ?? null
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewing, setViewing] = useState<CloudinaryImage | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshImages = async () => {
    const result = await getImagesAction(folder);
    if (result.success) {
      setImages(result.data || []);
      setNextCursor(result.nextCursor || null);
    }
  };

  const loadMoreImages = async () => {
    if (!nextCursor) return;
    setLoading(true);
    const result = await getImagesAction(folder, nextCursor, 20);
    setLoading(false);

    if (result.success) {
      setImages((prev) => [...prev, ...result.data]);
      setNextCursor(result.nextCursor || null);
    }
  };

  const handleDelete = async (publicId: string) => {
    const result = await deleteImageAction(publicId, path);
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    }
  };

  const handleBulkDelete = async (publicIds: string[]) => {
    for (const id of publicIds) {
      await deleteImageAction(id, path);
    }
    setImages((prev) =>
      prev.filter((img) => !publicIds.includes(img.public_id))
    );
  };

  return (
    <>
      <ImageUploadForm
        folder={folder}
        path={path}
        onUploadSuccess={refreshImages}
      />
      <ImagesToolbar
        folder={folder}
        images={images}
        setImages={setImages}
        selected={selected}
        setSelected={setSelected}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onBulkDelete={handleBulkDelete}
        setNextCursor={setNextCursor}
      />
      <ImagesGrid
        images={images}
        selected={selected}
        setSelected={setSelected}
        viewMode={viewMode}
        onDelete={handleDelete}
        onView={(img) => setViewing(img)}
        path={path}
      />
      {/* Load more button - works like pagination - shows 20 images per page */}
      {nextCursor && (
        <div className='flex justify-center bg-background pb-2.5 lg:pb-5 rounded-b-lg'>
          <Button
            onClick={loadMoreImages}
            disabled={loading || images.length === 0}
            className={`${
              loading || images.length === 0 ? 'cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
      {viewing && (
        <ImageModal
          image={viewing}
          onClose={() => setViewing(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
