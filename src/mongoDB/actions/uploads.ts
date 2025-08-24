'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId, WithId } from 'mongodb';
import client from '../client';
import { ImageUpload } from '../types';
import { getImageDimensionsFromBuffer } from '../utils';

export async function uploadImages(
  formData: FormData
): Promise<{ success: boolean; images?: ImageUpload[]; error?: string }> {
  try {
    const uploads: ImageUpload[] = [];
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return { success: false, error: 'No images provided' };
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      const dimensions = await getImageDimensionsFromBuffer(buffer, file.type);

      const imageData = {
        src: dataUrl,
        alt: file.name.split('.')[0],
        filename: file.name,
        filetype: file.type,
        width: dimensions.width,
        height: dimensions.height,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await client
        .db(process.env.MONGODB_DB!)
        .collection('uploads')
        .insertOne(imageData);

      const savedImage: ImageUpload = {
        ...imageData,
        _id: String(result.insertedId),
      };
      uploads.push(savedImage);
    }

    revalidatePath('/admin/image-manager');
    return { success: true, images: uploads };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: `Failed to upload images: ${error}` };
  }
}

export async function getUploadedImages() {
  try {
    const images = await client
      .db(process.env.MONGODB_DB!)
      .collection('uploads')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // Convert to the proper type by mapping and ensuring all required fields
    return images.map((image) => ({
      _id: image._id.toString(),
      src: image.src || '',
      alt: image.alt || '',
      filename: image.filename || '',
      filetype: image.filetype || '',
      width: image.width || 0,
      height: image.height || 0,
      createdAt: image.createdAt || null,
      updatedAt: image.updatedAt || null,
    })) as WithId<ImageUpload>[];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function deleteImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await client
      .db(process.env.MONGODB_DB!)
      .collection('uploads')
      .findOneAndDelete({
        _id: new ObjectId(imageId),
      });

    if (!result) return { success: false, error: 'Image not found' };

    revalidatePath('/admin/image-manager');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { success: false, error: `Failed to delete image: ${error}` };
  }
}

export async function updateImage(
  imageId: string,
  updates: { alt?: string; filename?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await client
      .db(process.env.MONGODB_DB!)
      .collection('uploads')
      .findOneAndUpdate(
        { _id: new ObjectId(imageId) },
        { $set: updates },
        { returnDocument: 'after' }
      );

    if (!result?._id) return { success: false, error: 'Image not found' };

    revalidatePath('/admin/image-manager');
    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: `Failed to update image: ${error}` };
  }
}
