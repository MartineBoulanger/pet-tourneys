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

// Helper function to create a slug from the title for guides, articles, and pet reviews
export function generatePageSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to set the text alignment
export function getTextAlignment(alignment: string) {
  switch (alignment) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
}

// Helper function to set the label for each page type
export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'articles':
      return 'Article';
    case 'guides':
      return 'Guide';
    case 'pet-reviews':
      return 'Pet Review';
    default:
      return type;
  }
};
