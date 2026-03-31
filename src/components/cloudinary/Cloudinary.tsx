'use client';

import { useState } from 'react';
import { UploadForm } from './Form';
import { Toolbar } from './Toolbar';
import { Layout } from './Layout';
import { Modal } from './Modal';
import { CloudinaryImage, CloudinaryProps } from '@/types/cloudinary.types';
import { getMultipleImages } from '@/actions/cloudinary/getImages';
import { deleteMultipleImages } from '@/actions/cloudinary/deleteImages';
import { Button } from '@/components/ui';

export function Cloudinary({
  folder,
  initImages,
  nextCursor: initialCursor,
  path,
}: CloudinaryProps) {
  const [images, setImages] = useState<CloudinaryImage[]>(
    () => initImages ?? [],
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialCursor ?? null,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewing, setViewing] = useState<CloudinaryImage | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshImages = async () => {
    const result = await getMultipleImages(folder);
    if (result.success) {
      setImages(result.data || []);
      setNextCursor(result.nextCursor || null);
    }
  };

  const loadMoreImages = async () => {
    if (!nextCursor) return;
    setLoading(true);
    const result = await getMultipleImages(folder, nextCursor, 20);
    setLoading(false);

    if (result.success) {
      const data = result && result.data ? result.data : [];
      setImages((prev) => [...prev, ...data]);
      setNextCursor(result.nextCursor || null);
    }
  };

  const handleDelete = async (publicId: string) => {
    const result = await deleteMultipleImages([publicId], path);
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    }
  };

  const handleBulkDelete = async (publicIds: string[]) => {
    for (const id of publicIds) {
      await deleteMultipleImages([id], path);
    }
    setImages((prev) =>
      prev.filter((img) => !publicIds.includes(img.public_id)),
    );
  };

  return (
    <>
      <UploadForm folder={folder} path={path} onUploadSuccess={refreshImages} />
      <Toolbar
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
      <Layout
        images={images}
        selected={selected}
        setSelected={setSelected}
        viewMode={viewMode}
        onDelete={handleDelete}
        onView={(img) => setViewing(img)}
        path={path}
      />
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
        <Modal
          image={viewing}
          onClose={() => setViewing(null)}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
