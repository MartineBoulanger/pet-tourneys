'use server';

import { revalidatePath } from 'next/cache';
import {
  uploadImage,
  deleteImage,
  getImages,
  getImage,
  searchImages,
} from '@/features/cloudinary/client';
import { CloudinaryImage } from '../types';

export async function uploadImageAction(formData: FormData, path: string) {
  const file = formData.get('image') as File;
  const folder = (formData.get('folder') as string) || 'pml-images';

  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const result = await uploadImage(file, folder);
    revalidatePath(path);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Multiple image upload action
export async function uploadMultipleImagesAction(
  formData: FormData,
  path: string
) {
  const files = formData.getAll('images');
  const folder = formData.get('folder') || 'pml-images';

  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  try {
    const uploadPromises = files.map((file) => {
      const fileFormData = new FormData();
      fileFormData.append('image', file);
      fileFormData.append('folder', folder);

      return uploadImageAction(fileFormData, path);
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r) => r.success);

    revalidatePath(path);
    return {
      success: true,
      data: successfulUploads.map((r) => r.data),
      count: successfulUploads.length,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteImageAction(publicId: string, path: string) {
  try {
    const result = await deleteImage(publicId);
    revalidatePath(path);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getImageAction(publicId: string) {
  try {
    const image = await getImage(publicId);
    return { success: true, data: image };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getImagesAction(
  folder: string = 'pml-images',
  nextCursor?: string,
  limit: number = 20
) {
  try {
    const { resources, nextCursor: newCursor } = await getImages(
      folder,
      nextCursor,
      limit
    );
    // 🔥 serialize only what you need
    const clean = resources.map((r: CloudinaryImage) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));
    return { success: true, data: clean, nextCursor: newCursor || null };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function searchImagesInFolder(
  query: string = '',
  folder: string = 'pml-images'
) {
  try {
    if (!query || query.trim() === '') {
      const images = await getImages(folder);
      return { success: true, data: images };
    } else {
      const images = await searchImages(query, folder);
      return { success: true, data: images };
    }
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
