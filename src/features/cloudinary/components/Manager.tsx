'use client';

import { useState } from 'react';
import { ImageUploadForm } from './UploadForm';
import { ImagesToolbar } from './Toolbar';
import { ImagesGrid } from './Grid';
import { ImageModal } from './Modal';
import { CloudinaryImage, ImagesManagerProps } from '../types';
import { Container } from '@/components/ui';
import { deleteImageAction, getImagesAction } from '../actions/cloudinary';

export function ImagesManager({
  folder,
  initImages,
  path,
}: ImagesManagerProps) {
  const [images, setImages] = useState(initImages);
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [viewing, setViewing] = useState<CloudinaryImage | null>(null);

  const refreshImages = async () => {
    const result = await getImagesAction(folder);
    if (result.success) setImages(result.data);
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
    <Container className='px-0 lg:px-0'>
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
      {viewing && (
        <ImageModal
          image={viewing}
          onClose={() => setViewing(null)}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
}
