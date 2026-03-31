'use server';

import { revalidatePath } from 'next/cache';
import { uploadImages } from './functions';
import { CloudinaryImage } from '@/types/cloudinary.types';

// =================================================
// Upload images
// =================================================
export const uploadMultipleImages = async (
  formData: FormData,
  path: string,
) => {
  const files = formData.getAll('images') as File[];
  const folder = (formData.get('folder') as string) || 'pml-images';
  if (!files?.length) throw new Error('No files provided');

  try {
    const results = await uploadImages(files, folder);
    const successful = results
      .filter(
        (r): r is PromiseFulfilledResult<CloudinaryImage> =>
          r.status === 'fulfilled',
      )
      .map((r) => r.value);
    revalidatePath(path);
    return {
      success: true,
      data: successful,
      count: successful.length,
      failed: results.length - successful.length,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
