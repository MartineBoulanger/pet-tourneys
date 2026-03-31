import { cloudinaryClient } from '@/lib/cloudinaryClient';

// ==================================================
// Upload Images to Cloudinary
// ==================================================
export const uploadImages = async (
  files: File[],
  folder: string = 'pml-images',
) => {
  const uploads = files.map(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ogName = file.name.replace(/\.[^/.]+$/, '');

    return new Promise((resolve, reject) => {
      cloudinaryClient.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            public_id: ogName,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });
  });

  return Promise.allSettled(uploads);
};

// ==================================================
// Delete Images from Cloudinary
// ==================================================
export const deleteImages = async (publicIds: string[]) => {
  const deletions = publicIds.map((publicId) =>
    cloudinaryClient.uploader.destroy(publicId),
  );
  return Promise.allSettled(deletions);
};

// ==================================================
// Get Images from Cloudinary
// ==================================================
export const getImages = async (
  folder: string = 'pml-images',
  nextCursor?: string,
  limit: number = 20,
) => {
  const result = await cloudinaryClient.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: limit,
    next_cursor: nextCursor,
  });
  return {
    resources: result.resources,
    nextCursor: result.next_cursor || null,
  };
};

// ==================================================
// Search Images from Cloudinary
// ==================================================
export const searchImages = async (
  query: string,
  folder: string = 'pml-images',
) => {
  const result = await cloudinaryClient.search
    .expression(`folder:${folder} AND filename:${query}*`)
    .max_results(20)
    .execute();
  return result.resources;
};
