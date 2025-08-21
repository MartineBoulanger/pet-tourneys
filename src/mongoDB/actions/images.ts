'use server';

import { revalidatePath } from 'next/cache';
import { ImageUpload } from '../types';
import {
  getImageDimensionsFromBuffer,
  serializeImage,
  serializeImages,
} from '../utils';
import { Upload } from '../models/Upload';
import dbConnect from '../client';

export async function uploadImages(
  formData: FormData
): Promise<{ success: boolean; images?: ImageUpload[]; error?: string }> {
  try {
    await dbConnect();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return { success: false, error: 'No images provided' };
    }

    const uploads: ImageUpload[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;
      const dimensions = await getImageDimensionsFromBuffer(buffer, file.type);

      const imageData = {
        src: dataUrl,
        alt: file.name.split('.')[0],
        width: dimensions.width,
        height: dimensions.height,
        usedIn: [],
        usedInModel: undefined,
      };

      const newUpload = new Upload(imageData);
      const savedImage = await newUpload.save();

      // Serialize the saved document to plain object
      const serializedImage = serializeImage(savedImage);
      uploads.push(serializedImage);
    }

    revalidatePath('/admin/image-manager');
    return { success: true, images: uploads };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload images' };
  }
}

export async function getUploadedImages(): Promise<ImageUpload[]> {
  try {
    await dbConnect();
    const images = await Upload.find().sort({ createdAt: -1 }).lean();
    return serializeImages(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function deleteImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await dbConnect();
    const result = await Upload.findOneAndDelete({ _id: imageId });
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
  updates: { alt?: string; usedIn?: string[]; usedInModel?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    await dbConnect();
    const result = await Upload.findOneAndUpdate({ _id: imageId }, updates, {
      new: true,
    });
    if (!result) return { success: false, error: 'Image not found' };
    revalidatePath('/admin/image-manager');
    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: 'Failed to update image' };
  }
}
