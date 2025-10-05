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
    const originalName = file.name.replace(/\.[^/.]+$/, '');
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          public_id: originalName,
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

export async function getImages(
  folder: string = 'pml-images',
  nextCursor?: string,
  limit: number = 20
) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: limit,
    next_cursor: nextCursor,
  });

  return {
    resources: result.resources,
    nextCursor: result.next_cursor || null,
  };
}

export async function searchImages(
  query: string,
  folder: string = 'pml-images'
) {
  const result = await cloudinary.search
    .expression(`folder:${folder} AND filename:${query}*`)
    .max_results(20)
    .execute();

  return result.resources;
}
