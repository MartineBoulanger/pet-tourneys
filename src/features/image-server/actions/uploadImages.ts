'use server';

import { revalidatePath } from 'next/cache';
import { getImageDimensionsFromBuffer } from '../utils';
import { BASE } from '../types';

// --- Upload ---
export async function uploadImage(formData: FormData) {
  try {
    const res = await fetch(`${BASE}/api/images`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload failed:', res.status, errorText);
      throw new Error(`Upload failed: ${res.status}`);
    }

    const result = await res.json();
    revalidatePath('/admin/images');
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// --- Upload multiple images ---
export async function uploadMultipleImages(
  files: File[],
  commonData: { title?: string; alt?: string; tags?: string[] }
) {
  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();

    // Add the file
    formData.append('image', file);

    // Add metadata with file-specific defaults
    const fileBaseName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    formData.append('title', commonData.title || fileBaseName);
    formData.append('alt', commonData.alt || `Image: ${fileBaseName}`);

    if (commonData.tags && commonData.tags.length > 0) {
      formData.append('tags', commonData.tags.join(','));
    }

    // Add dimensions as custom metadata
    try {
      const buffer = await file.arrayBuffer();
      const dimensions = await getImageDimensionsFromBuffer(buffer, file.type);
      formData.append('width', JSON.stringify(dimensions.width));
      formData.append('height', JSON.stringify(dimensions.height));
    } catch (error) {
      console.warn(`Could not extract dimensions for ${file.name}:`, error);
      formData.append('width', JSON.stringify(0));
      formData.append('height', JSON.stringify(0));
    }

    try {
      const result = await uploadImage(formData);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      errors.push({
        file: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return { results, errors };
}
