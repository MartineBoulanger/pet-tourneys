import { ObjectId } from 'mongodb';
import { getCollection } from './client';
import { ImageUpload } from './types';

/**
 * get the image or images from the uploads collection for the components
 * @function getImagesByIds - for multiple images
 * @function getImageById - for a single image
 */
export async function getImagesByIds(
  imageIds: string[]
): Promise<ImageUpload[]> {
  try {
    const validObjectIds = imageIds
      .filter((id) => id && typeof id === 'string' && id.trim() !== '')
      .map((id) => {
        try {
          if (new ObjectId(id)) {
            return new ObjectId(id);
          }
          return null;
        } catch (error) {
          console.warn('Invalid ObjectId:', id, error);
          return null;
        }
      })
      .filter((id): id is ObjectId => id !== null);

    if (validObjectIds.length === 0) {
      return [];
    }

    const db = await getCollection('uploads');
    const images = await db.find({ _id: { $in: validObjectIds } }).toArray();

    return images.map((image) => ({
      _id: String(image._id),
      src: image.src ?? '',
      alt: image.alt ?? '',
      filename: image.filename ?? '',
      filetype: image.filetype ?? '',
      width: image.width ?? 0,
      height: image.height ?? 0,
      createdAt: image.createdAt ?? null,
      updatedAt: image.updatedAt ?? null,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function getImageById(
  imageId: string
): Promise<ImageUpload | null> {
  try {
    const db = await getCollection('uploads');
    const image = await db.findOne({ _id: new ObjectId(imageId) });

    return {
      _id: String(image?._id),
      src: image?.src ?? '',
      alt: image?.alt ?? '',
      filename: image?.filename ?? '',
      filetype: image?.filetype ?? '',
      width: image?.width ?? 0,
      height: image?.height ?? 0,
      createdAt: image?.createdAt ?? null,
      updatedAt: image?.updatedAt ?? null,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}

/**
 * Get the dimensions from each image
 * @function getImageDimensionsFromBuffer - checks the buffer to then use the correct function to set the width and height of the image
 * @function getPNGDimensions - for PNG images
 * @function getJPEGDimensions - for JPEG and JPG images
 * @function getWebPDimensions - for WebP images
 * @function getGIFDimensions - fir GIF images
 */
export async function getImageDimensionsFromBuffer(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<{ width: number; height: number }> {
  try {
    // Simple dimension extraction for common formats
    const uint8Array = new Uint8Array(buffer);

    if (mimeType === 'image/png') {
      return getPNGDimensions(uint8Array);
    } else if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      return getJPEGDimensions(uint8Array);
    } else if (mimeType === 'image/gif') {
      return getGIFDimensions(uint8Array);
    } else if (mimeType === 'image/webp') {
      return getWebPDimensions(uint8Array);
    }

    // Fallback: return 0 dimensions
    return { width: 0, height: 0 };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: 0, height: 0 };
  }
}

function getPNGDimensions(data: Uint8Array): { width: number; height: number } {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (data.length < 24) return { width: 0, height: 0 };

  // Check PNG signature
  if (
    data[0] !== 0x89 ||
    data[1] !== 0x50 ||
    data[2] !== 0x4e ||
    data[3] !== 0x47
  ) {
    return { width: 0, height: 0 };
  }

  // Width and height are at bytes 16-23 (big-endian)
  const width =
    (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
  const height =
    (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];

  return { width, height };
}

function getJPEGDimensions(data: Uint8Array): {
  width: number;
  height: number;
} {
  if (data.length < 4) return { width: 0, height: 0 };

  // Check JPEG signature
  if (data[0] !== 0xff || data[1] !== 0xd8) {
    return { width: 0, height: 0 };
  }

  let offset = 2;
  while (offset < data.length) {
    // Find next marker
    if (data[offset] !== 0xff) break;

    const marker = data[offset + 1];
    offset += 2;

    // SOF markers contain dimension info
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      if (offset + 5 >= data.length) break;

      const height = (data[offset + 3] << 8) | data[offset + 4];
      const width = (data[offset + 5] << 8) | data[offset + 6];

      return { width, height };
    }

    // Skip this segment
    if (offset + 2 >= data.length) break;
    const segmentLength = (data[offset] << 8) | data[offset + 1];
    offset += segmentLength;
  }

  return { width: 0, height: 0 };
}

function getGIFDimensions(data: Uint8Array): { width: number; height: number } {
  if (data.length < 10) return { width: 0, height: 0 };

  // Check GIF signature
  const signature = String.fromCharCode(...data.slice(0, 6));
  if (signature !== 'GIF87a' && signature !== 'GIF89a') {
    return { width: 0, height: 0 };
  }

  // Width and height are at bytes 6-9 (little-endian)
  const width = data[6] | (data[7] << 8);
  const height = data[8] | (data[9] << 8);

  return { width, height };
}

function getWebPDimensions(data: Uint8Array): {
  width: number;
  height: number;
} {
  if (data.length < 30) return { width: 0, height: 0 };

  // Check RIFF signature
  const riff = String.fromCharCode(...data.slice(0, 4));
  const webp = String.fromCharCode(...data.slice(8, 12));

  if (riff !== 'RIFF' || webp !== 'WEBP') {
    return { width: 0, height: 0 };
  }

  const format = String.fromCharCode(...data.slice(12, 16));

  if (format === 'VP8 ') {
    // Simple WebP
    if (data.length < 30) return { width: 0, height: 0 };
    const width =
      ((data[26] | (data[27] << 8) | (data[28] << 16)) & 0x3fff) + 1;
    const height =
      (((data[28] >> 2) | (data[29] << 6) | (data[30] << 14)) & 0x3fff) + 1;
    return { width, height };
  } else if (format === 'VP8L') {
    // Lossless WebP
    if (data.length < 25) return { width: 0, height: 0 };
    const bits =
      (data[21] | (data[22] << 8) | (data[23] << 16) | (data[24] << 24)) >>> 0;
    const width = (bits & 0x3fff) + 1;
    const height = ((bits >> 14) & 0x3fff) + 1;
    return { width, height };
  } else if (format === 'VP8X') {
    // Extended WebP
    if (data.length < 30) return { width: 0, height: 0 };
    const width =
      ((data[24] | (data[25] << 8) | (data[26] << 16)) & 0xffffff) + 1;
    const height =
      ((data[27] | (data[28] << 8) | (data[29] << 16)) & 0xffffff) + 1;
    return { width, height };
  }

  return { width: 0, height: 0 };
}
