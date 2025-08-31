'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { getImageById } from '@/features/image-server/actions/getImages';
import { connectToDatabase, getCollection } from '../client';
import { Signup } from '../types';

export async function createSignup(data: Partial<Signup>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    if (!data.images || data.images.length === 0)
      return { success: false, error: 'At least one signup item is required' };

    // Validate each image has required fields
    for (const image of data.images) {
      if (
        !image.imageId?.trim() ||
        !image.imageName?.trim() ||
        !image.signupUrl?.trim()
      ) {
        return {
          success: false,
          error:
            'All signup items must have Image ID, Image Name, and Signup URL',
        };
      }
    }

    const db = await getCollection('signups');

    // Process images to ensure proper order
    const processedImages = data.images.map((image, index) => ({
      imageId: image.imageId.trim(),
      imageName: image.imageName.trim(),
      imageAlt: image.imageAlt?.trim() || undefined,
      signupUrl: image.signupUrl.trim(),
      order: image.order || index + 1,
    }));

    const signupData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      isVisible: data.isVisible ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(signupData);

    revalidatePath('/admin/homepage');

    return {
      success: true,
      signup: {
        _id: String(result.insertedId),
        ...signupData,
      },
    };
  } catch (error) {
    console.error('Failed to create signup:', error);
    return { success: false, error: 'Failed to create signup section' };
  }
}

export async function updateSignup(signupId: string, data: Partial<Signup>) {
  try {
    if (!ObjectId.isValid(signupId))
      return { success: false, error: 'Invalid signup ID' };

    // Validate that we have at least one image
    if (!data.images || data.images.length === 0) {
      return {
        success: false,
        error: 'At least one signup item is required',
      };
    }

    // Validate each image has required fields
    for (const image of data.images) {
      if (
        !image.imageId?.trim() ||
        !image.imageName?.trim() ||
        !image.signupUrl?.trim()
      ) {
        return {
          success: false,
          error:
            'All signup items must have Image ID, Image Name, and Signup URL',
        };
      }
    }

    const db = await getCollection('signups');

    // Process images to ensure proper order
    const processedImages = data.images.map((image, index) => ({
      imageId: image.imageId.trim(),
      imageName: image.imageName.trim(),
      imageAlt: image.imageAlt?.trim() || undefined,
      signupUrl: image.signupUrl.trim(),
      order: image.order || index + 1,
    }));

    const updateData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '2',
      isVisible: data.isVisible ?? true,
      updatedAt: new Date(),
    };

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(signupId) },
      { $set: updateData }
    );

    if (!result) {
      return { success: false, error: 'Signup section not found' };
    }

    revalidatePath('/admin/homepage');

    return { success: true };
  } catch (error) {
    console.error('Failed to update signup:', error);
    return { success: false, error: 'Failed to update signup section' };
  }
}

export async function deleteSignup(signupId: string) {
  try {
    if (!ObjectId.isValid(signupId))
      return { success: false, error: 'Invalid signup ID' };

    const db = await getCollection('signups');
    const deleteSignup = await db.findOneAndDelete({
      _id: new ObjectId(signupId),
    });

    if (!deleteSignup)
      return { success: false, error: 'Signup section not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete signup:', error);
    return { success: false, error: 'Failed to delete signup section' };
  }
}

export async function getSignups(): Promise<{
  success: boolean;
  signups?: Signup[];
  error?: string;
}> {
  try {
    const db = await getCollection('signups');
    const signups = await db.find({}).sort({ createdAt: -1 }).toArray();

    const processedSignups = signups.map((signup) => ({
      _id: String(signup._id),
      title: signup.title,
      images: signup.images,
      layout: signup.layout,
      isVisible: signup.isVisible,
      createdAt: signup.createdAt,
      updatedAt: signup.updatedAt,
    }));

    return { success: true, signups: processedSignups };
  } catch (error) {
    console.error('Failed to fetch signups:', error);
    return { success: false, error: 'Failed to fetch signup sections' };
  }
}

export async function getVisibleSignup() {
  try {
    const db = await getCollection('signups');
    const signup = await db.findOne<Signup>({ isVisible: true });

    if (!signup) return { success: true, signup: null };

    // Get images for each signup item
    const imagesWithData = await Promise.all(
      signup.images.map(async (image) => {
        const imageData = await getImageById(image.imageId);
        return {
          ...image,
          imageData,
        };
      })
    );

    return {
      success: true,
      signup: {
        ...signup,
        images: imagesWithData,
        _id: String(signup._id),
      },
    };
  } catch (error) {
    console.error('Failed to get visible signup:', error);
    return { success: false, error: 'Failed to get visible signup section' };
  }
}

export async function setVisibleSignup(signupId: string) {
  try {
    if (!ObjectId.isValid(signupId))
      return { success: false, error: 'Invalid signup ID' };

    const db = await getCollection('signups');
    const signup = await db.findOne({
      _id: new ObjectId(signupId),
    });

    if (!signup) return { success: false, error: 'Signup section not found' };

    const { client } = await connectToDatabase();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Hide all other signup sections
        await db.updateMany(
          {},
          { $set: { isVisible: false, updatedAt: new Date() } },
          { session }
        );

        // Make this signup section visible
        await db.updateOne(
          { _id: new ObjectId(signupId) },
          { $set: { isVisible: true, updatedAt: new Date() } },
          { session }
        );
      });

      revalidatePath('/admin/homepage');
      return { success: true };
    } catch (error) {
      console.error('Failed to set visibility:', error);
      return { success: false, error: 'Failed to set visibility' };
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Failed to set visible signup:', error);
    return { success: false, error: 'Failed to set visible signup section' };
  }
}

export async function hideSignup(signupId: string) {
  try {
    if (!ObjectId.isValid(signupId))
      return { success: false, error: 'Invalid signup ID' };

    const db = await getCollection('signups');
    const result = await db.updateOne(
      { _id: new ObjectId(signupId) },
      { $set: { isVisible: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0)
      return { success: false, error: 'Signup section not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to hide signup:', error);
    return { success: false, error: 'Failed to hide signup section' };
  }
}
