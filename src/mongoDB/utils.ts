import { ImageUpload, MongoImageDocument } from './types';

/**
 * Serializes a MongoDB document to a plain object safe for client components
 */
export function serializeImage(doc: MongoImageDocument): ImageUpload {
  return {
    _id: doc._id.toString(),
    src: doc.src,
    alt: doc.alt,
    width: doc.width,
    height: doc.height,
    usedIn: doc.usedIn.map((id: any) => id.toString()),
    usedInModel: doc.usedInModel || undefined,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

/**
 * Serializes an array of MongoDB documents
 */
export function serializeImages(docs: any[]): ImageUpload[] {
  return docs.map((doc) => serializeImage(doc));
}

/**
 * Get the dimensions from each image
 */
export async function getImageDimensionsFromBuffer(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<{ width: number; height: number }> {
  try {
    // For a production app, use a proper image processing library like Sharp:
    // const sharp = require('sharp');
    // const metadata = await sharp(Buffer.from(buffer)).metadata();
    // return { width: metadata.width || 0, height: metadata.height || 0 };

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
// PNG dimension extraction
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
// JPEG dimension extraction
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
// GIF dimension extraction
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

// WebP dimension extraction
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
