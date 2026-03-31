'use server';

import { getImages } from './functions';
import { CloudinaryImage } from '@/types/cloudinary.types';

// =================================================
// Get images
// =================================================
export const getMultipleImages = async (
  folder: string = 'pml-images',
  nextCursor?: string,
  limit: number = 20,
) => {
  try {
    const { resources, nextCursor: nc } = await getImages(
      folder,
      nextCursor,
      limit,
    );
    const clean = resources.map((r: CloudinaryImage) => ({
      public_id: r.public_id,
      display_name: r.display_name,
      original_filename: r.original_filename,
      secure_url: r.secure_url,
      format: r.format,
      bytes: r.bytes,
      width: r.width,
      height: r.height,
      created_at: r.created_at,
    }));
    return {
      success: true,
      data: clean as CloudinaryImage[],
      nextCursor: nc || null,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Get image by Cloudinary url - for the bulk pets upload form
// =================================================
export async function getImageByUrl(
  url: string,
  folder: string = 'pml-images',
): Promise<CloudinaryImage | null> {
  try {
    if (!url) return null;

    // Get ALL images from the folder (paginate through all pages)
    const allImages: CloudinaryImage[] = [];
    let nextCursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const result = await getMultipleImages(folder, nextCursor);

      if (!result.success || !result.data) {
        break;
      }

      allImages.push(...result.data);
      nextCursor = result.nextCursor || undefined;
      hasMore = !!result.nextCursor;
    }

    // Find the image that matches the URL
    const image = allImages.find((img) => img.secure_url === url);

    return image || null;
  } catch (error) {
    console.error('Error finding image by URL:', error);
    return null;
  }
}

export async function getImagesByUrls(
  urls: string[],
  folders: string[] = ['pml-pet-icons', 'pml-pet-images'],
): Promise<Map<string, CloudinaryImage>> {
  const imageMap = new Map<string, CloudinaryImage>();

  // Remove duplicates and empty strings
  const uniqueUrls = [...new Set(urls.filter(Boolean))];

  if (uniqueUrls.length === 0) {
    return imageMap;
  }

  try {
    // Create a Set for faster lookup
    const urlSet = new Set(uniqueUrls);

    // Fetch ALL images from each folder by paginating through all pages
    const allImagesPromises = folders.map(async (folder) => {
      const allImages: CloudinaryImage[] = [];
      let nextCursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        try {
          const result = await getMultipleImages(folder, nextCursor);

          if (result.success && result.data) {
            allImages.push(...result.data);
            nextCursor = result.nextCursor || undefined;
            hasMore = !!result.nextCursor;
          } else {
            hasMore = false;
          }
        } catch (error) {
          console.error(`Error fetching page from folder ${folder}:`, error);
          hasMore = false;
        }
      }

      return { folder, images: allImages };
    });

    const folderResults = await Promise.all(allImagesPromises);

    // Build a map of URL -> CloudinaryImage, filtering by requested URLs
    folderResults.forEach(({ images }) => {
      images.forEach((img) => {
        // Only add images that were requested
        if (img?.secure_url && urlSet.has(img.secure_url)) {
          imageMap.set(img.secure_url, img);
        }
      });
    });

    // Log missing images
    const foundUrls = new Set(imageMap.keys());
    const missingUrls = uniqueUrls.filter((url) => !foundUrls.has(url));

    if (missingUrls.length > 0) {
      console.warn('Images not found in Cloudinary:', missingUrls);

      // Try individual fetch as fallback for missing images
      await Promise.all(
        missingUrls.map(async (url) => {
          try {
            // Extract folder from URL for the fallback
            const urlParts = url.split('/');
            const versionIndex = urlParts.findIndex((part) =>
              part.startsWith('v'),
            );
            const folder = urlParts[versionIndex + 1];

            // Try to fetch just this specific image by its URL
            const image = await getImageByUrl(url, folder);
            if (image) {
              imageMap.set(url, image);
            }
          } catch (error) {
            console.error('Error fetching images in batch:', error);
            // Ignore fallback errors
          }
        }),
      );
    }

    return imageMap;
  } catch (error) {
    console.error('Error fetching images in batch:', error);
    return imageMap;
  }
}
