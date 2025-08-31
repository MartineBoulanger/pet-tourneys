'use server';

import { ImageRecord, BASE } from '../types';
import { wakeUpServer } from '../utils';

// --- List ---
export async function listImages(
  page: number = 1,
  search: string = '',
  limit: number = 20
) {
  try {
    // Wake up server if this is likely the first request
    if (page === 1 && !search) {
      await wakeUpServer();
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const url = `${BASE}/api/images?page=${page}&limit=${limit}&search=${encodeURIComponent(
      search
    )}`;
    console.log('Fetching images from:', url);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res
        .text()
        .catch(() => 'No error message available');
      console.error('List images failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
        url,
      });

      // Return empty result instead of throwing for better UX
      if (res.status === 503) {
        console.log('Server unavailable, returning empty result');
        return { items: [], total: 0, page, limit, hasMore: false };
      }

      throw new Error(
        `Bad response from CMS: ${res.status} - ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log('Images fetched successfully:', {
      count: data.items?.length || 0,
      total: data.total,
      page: data.page,
    });

    // Calculate hasMore based on pagination
    const hasMore = data.page * data.limit < data.total;

    return {
      ...data,
      hasMore,
    };
  } catch (error) {
    console.error('listImages failed:', error);
    return { items: [], total: 0, page, limit, hasMore: false };
  }
}

// --- Single Image ---
export async function getImage(id: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${BASE}/api/images/${id}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Fetch image failed:', res.status, errorText);
      throw new Error(`Bad response from server: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch image failed:', err);
    return null;
  }
}

/**
 * get the image or images from the uploads collection for the components
 * @function getImagesByIds - for multiple images
 * @function getImageById - for a single image
 */
export async function getImagesByIds(
  imageIds: string[]
): Promise<ImageRecord[]> {
  try {
    const validIds = imageIds.filter(
      (id) => id && typeof id === 'string' && id.trim() !== ''
    );

    if (validIds.length === 0) {
      return [];
    }

    const images = await listImages();
    const requestedImages =
      images.items?.filter((image: ImageRecord) =>
        validIds.includes(image.id)
      ) || [];

    return requestedImages?.map((image: ImageRecord) => ({
      id: String(image?.id) ?? '',
      title: image?.title ?? '',
      size: image?.size ?? 0,
      tags: image?.tags ?? [],
      url: image?.url ?? '',
      alt: image?.alt ?? '',
      filename: image?.filename ?? '',
      mimetype: image?.mimetype ?? '',
      width: image?.width ?? 0,
      height: image?.height ?? 0,
      custom: image?.custom ?? undefined,
      uploadedAt: image?.uploadedAt ?? null,
      updatedAt: image?.updatedAt ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching images by IDs:', error);
    return [];
  }
}

export async function getImageById(
  imageId: string
): Promise<ImageRecord | null> {
  try {
    const imageResponse = await getImage(imageId);
    const image = imageResponse || null;

    if (!image || !image.id) {
      console.warn('No image found with ID:', imageId);
      return null;
    }

    return {
      id: String(image?.id),
      title: image?.title ?? '',
      size: image?.size ?? 0,
      tags: image?.tags ?? [],
      url: image?.url ?? '',
      alt: image?.alt ?? '',
      filename: image?.filename ?? '',
      mimetype: image?.mimetype ?? '',
      width: image?.width ?? 0,
      height: image?.height ?? 0,
      custom: image?.custom ?? undefined,
      uploadedAt: image?.uploadedAt ?? null,
      updatedAt: image?.updatedAt ?? undefined,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}
