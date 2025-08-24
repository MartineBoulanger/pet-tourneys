'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId, WithId } from 'mongodb';
import { connectToDatabase } from '../client';
import { ImageUpload } from '../types';
import { getImageDimensionsFromBuffer } from '../utils';

export async function uploadImages(
  formData: FormData
): Promise<{ success: boolean; images?: ImageUpload[]; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('uploads');

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

      const result = await collection.insertOne(imageData);
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
    return { success: false, error: 'Failed to upload images' };
  }
}

export async function getUploadedImages() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('uploads');

    const images = await collection.find().sort({ createdAt: -1 }).toArray();

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
    const { db } = await connectToDatabase();
    const collection = db.collection('uploads');

    const result = await collection.findOneAndDelete({
      _id: new ObjectId(imageId),
    });

    if (!result) return { success: false, error: 'Image not found' };

    revalidatePath('/admin/image-manager');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete image:', error);
    return { success: false, error: 'Failed to delete image' };
  }
}

export async function updateImage(
  imageId: string,
  updates: { alt?: string; filename?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('uploads');

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(imageId) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result?._id) return { success: false, error: 'Image not found' };

    revalidatePath('/admin/image-manager');
    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: 'Failed to update image' };
  }
}
