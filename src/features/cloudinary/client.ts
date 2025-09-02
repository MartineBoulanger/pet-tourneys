import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File, folder: string = 'pml-images') {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export async function updateImage(publicId: string, updates: any) {
  // For Cloudinary, we can add metadata using the admin API
  try {
    // This updates the image context (alt text, caption, etc.)
    await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      context: {
        alt: updates.alt,
        caption: updates.title,
      },
      tags: updates.tags.join(','),
    });

    return {
      ...updates,
      id: publicId,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Update error:', error);
    throw new Error('Failed to update image metadata');
  }
}

export async function getImage(publicId: string) {
  try {
    // Get image details
    const result = await cloudinary.api.resource(publicId);
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image');
  }
}

export async function getImages(folder: string = 'pml-images') {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500,
  });

  return result.resources;
}
