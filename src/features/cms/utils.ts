import { CloudinaryImage } from '../cloudinary/types';

// Helper function to get Cloudinary image
export async function getCloudinaryImage(
  publicId: string
): Promise<CloudinaryImage | null> {
  try {
    const image = await getCloudinaryImage(publicId);
    return image;
  } catch (error) {
    console.error('Error fetching Cloudinary image:', error);
    return null;
  }
}
