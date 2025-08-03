'use server';

import dbConnect from '@/mongoDB/client';
import Image from '@/mongoDB/models/Image';

export async function uploadImage(formData: FormData) {
  try {
    await dbConnect();

    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // First check if image with same filename exists
    const existingImage = await Image.findOne({ filename: file.name });
    if (existingImage) {
      return {
        success: true,
        imageId: existingImage._id.toString(),
        existing: true, // Flag to indicate this is an existing image
      };
    }

    // If not exists, proceed with upload
    const buffer = Buffer.from(await file.arrayBuffer());

    const newImage = new Image({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      data: buffer,
    });

    await newImage.save();

    return {
      success: true,
      imageId: newImage._id.toString(),
      existing: false,
    };
  } catch (error) {
    console.error('Failed to upload image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

export async function getImage(imageId: string) {
  try {
    await dbConnect();

    if (!imageId) {
      throw new Error('Image ID required');
    }

    const image = await Image.findById(imageId);
    if (!image) {
      throw new Error('Image not found');
    }

    return {
      success: true,
      image: {
        data: image.data,
        mimeType: image.mimeType,
        size: image.size,
      },
    };
  } catch (error) {
    console.error('Failed to fetch image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch image',
    };
  }
}
