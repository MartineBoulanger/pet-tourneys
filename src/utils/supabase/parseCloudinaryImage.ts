import { CloudinaryImage } from '@/types/cloudinary.types';

// =================================================
// Helper function for Cloudinary images
// - to safely cast JSON to CloudinaryImage type
// =================================================
export function parseCloudinaryImage(json: unknown): CloudinaryImage | null {
  if (!json || typeof json !== 'object') return null;

  // Check if it has the required CloudinaryImage properties
  const obj = json as Record<string, unknown>;
  if (typeof obj.public_id === 'string' && typeof obj.secure_url === 'string') {
    return obj as CloudinaryImage;
  }
  return null;
}
