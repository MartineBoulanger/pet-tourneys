'use server';

import { revalidatePath } from 'next/cache';
import { deleteImages } from './functions';
import { CloudinaryImage } from '@/types/cloudinary.types';

// =================================================
// Delete images
// =================================================
export const deleteMultipleImages = async (
  publicIds: string[],
  path: string,
) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  if (!ids?.length) throw new Error('No images provided');
  try {
    const results = await deleteImages(ids);
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
      total: ids.length,
      failed: results.filter((r) => r.status === 'rejected').length,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
