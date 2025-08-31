'use server';

import { revalidatePath } from 'next/cache';
import { getImageDimensionsFromBuffer, wakeUpServer } from '../utils';
import { BASE } from '../types';

// --- Upload ---
export async function uploadImage(formData: FormData, retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 2000; // Start with 2 seconds
  const retryDelay = baseDelay * Math.pow(2, retryCount); // Exponential backoff

  try {
    // For first attempt or after 503 error, try to wake up the server
    if (retryCount === 0) {
      await wakeUpServer();
      // Give the server a moment to fully wake up
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`Upload attempt ${retryCount + 1}/${maxRetries + 1}`);

    // Increased timeout for Render's slower response times
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    const res = await fetch(`${BASE}/api/images`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res
        .text()
        .catch(() => 'No error message available');
      console.error('Upload failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
        url: `${BASE}/api/images`,
        attempt: retryCount + 1,
      });

      // Handle 503 Service Unavailable (common with Render cold starts)
      if (res.status === 503 && retryCount < maxRetries) {
        console.log(
          `Server unavailable (503), waiting ${retryDelay}ms before retry ${
            retryCount + 1
          }/${maxRetries}...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return uploadImage(formData, retryCount + 1);
      }

      // Handle 429 Rate Limiting
      if (res.status === 429 && retryCount < maxRetries) {
        console.log(
          `Rate limited (429), waiting ${retryDelay}ms before retry ${
            retryCount + 1
          }/${maxRetries}...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return uploadImage(formData, retryCount + 1);
      }

      // Handle 502 Bad Gateway (common with serverless/container restarts)
      if (res.status === 502 && retryCount < maxRetries) {
        console.log(
          `Bad gateway (502), waiting ${retryDelay}ms before retry ${
            retryCount + 1
          }/${maxRetries}...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return uploadImage(formData, retryCount + 1);
      }

      // Handle timeout or connection errors
      if (
        (res.status === 524 || res.status === 408) &&
        retryCount < maxRetries
      ) {
        console.log(
          `Timeout error (${
            res.status
          }), waiting ${retryDelay}ms before retry ${
            retryCount + 1
          }/${maxRetries}...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return uploadImage(formData, retryCount + 1);
      }

      throw new Error(
        `Upload failed: ${res.status} - ${res.statusText || errorText}`
      );
    }

    const result = await res.json();
    console.log('Upload successful:', {
      id: result.id,
      filename: result.filename,
    });

    revalidatePath('/admin/images');
    return result;
  } catch (error) {
    console.error(`Upload error on attempt ${retryCount + 1}:`, error);
    if (retryCount < maxRetries) {
      console.log(
        `Upload timeout, waiting ${retryDelay}ms before retry ${
          retryCount + 1
        }/${maxRetries}...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return uploadImage(formData, retryCount + 1);
    }
    throw new Error(
      'Upload timeout - server took too long to respond after multiple attempts'
    );
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

      // Small delay between uploads to be gentler on the server
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      errors.push({
        file: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
        index: i,
      });
    }
  }

  return { results, errors };
}
