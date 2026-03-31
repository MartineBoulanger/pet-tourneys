'use server';

import { searchImages, getImages } from './functions';

// =================================================
// Search images
// =================================================
export const searchImagesPerFolder = async (
  query: string = '',
  folder: string = 'pml-images',
) => {
  try {
    const images = query?.trim()
      ? await searchImages(query, folder)
      : await getImages(folder);

    return { success: true, data: images };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
