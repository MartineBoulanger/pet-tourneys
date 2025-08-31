'use server';

import { ImageRecord, BASE } from '../types';

// --- List ---
export async function listImages(
  page: number = 1,
  search: string = '',
  limit: number = 20
) {
  try {
    const res = await fetch(
      `${BASE}/api/images?page=${page}&limit=${limit}&search=${search}`,
      {
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('List images failed:', res.status, errorText);
      throw new Error(`Bad response from CMS: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('listImages failed:', err);
    return null;
  }
}

// --- Single Image ---
export async function getImage(id: string) {
  try {
    const res = await fetch(`${BASE}/api/images/${id}`, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

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
