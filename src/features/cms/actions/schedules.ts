'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { connectToDatabase, getCollection } from '../client';
import { Schedule } from '../types';

export async function createSchedule(data: Partial<Schedule>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };
    if (!data.images || data.images.length === 0)
      return {
        success: false,
        error: 'At least one schedule item is required',
      };

    for (const image of data.images) {
      if (
        !image.imageName?.trim() ||
        !image.image ||
        !image.imageDate?.trim()
      ) {
        return {
          success: false,
          error: 'All schedule items must have image ID, image name, and date',
        };
      }
    }

    const db = await getCollection('schedules');

    const processedImages = data.images.map((image, index) => ({
      image: image.image || null,
      imageName: image.imageName.trim(),
      imageDate: image.imageDate.trim(),
      order: image.order || index + 1,
    }));

    const scheduleData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      description: data.description?.trim() || '',
      isVisible: data.isVisible || true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(scheduleData);

    revalidatePath('/admin/homepage');

    return {
      success: true,
      schedule: {
        _id: String(result.insertedId),
        ...scheduleData,
      },
    };
  } catch (error) {
    console.error('Failed to create schedule:', error);
    return { success: false, error: 'Failed to create schedule section' };
  }
}

export async function updateSchedule(
  scheduleId: string,
  data: Partial<Schedule>
) {
  try {
    if (!ObjectId.isValid(scheduleId))
      return { success: false, error: 'Invalid signup ID' };

    // Validate that we have at least one image
    if (!data.images || data.images.length === 0) {
      return {
        success: false,
        error: 'At least one schedule item is required',
      };
    }

    // Validate each image has required fields
    for (const image of data.images) {
      if (
        !image.image ||
        !image.imageName?.trim() ||
        !image.imageDate?.trim()
      ) {
        return {
          success: false,
          error: 'All schedule items must have Image ID, Image Name, and Date',
        };
      }
    }

    const db = await getCollection('schedules');

    const processedImages = data.images.map((image, index) => ({
      image: image.image || null,
      imageName: image.imageName.trim(),
      imageDate: image.imageDate.trim(),
      order: image.order || index + 1,
    }));

    const updateData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      description: data.description?.trim() || '',
      isVisible: data.isVisible || true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(scheduleId) },
      { $set: updateData }
    );

    if (!result) {
      return { success: false, error: 'Schedule section not found' };
    }

    revalidatePath('/admin/homepage');

    return { success: true };
  } catch (error) {
    console.error('Failed to update schedule:', error);
    return { success: false, error: 'Failed to update schedule section' };
  }
}

export async function deleteSchedule(scheduleId: string) {
  try {
    if (!ObjectId.isValid(scheduleId))
      return { success: false, error: 'Invalid signup ID' };

    const db = await getCollection('schedules');
    const deleteSchedule = await db.findOneAndDelete({
      _id: new ObjectId(scheduleId),
    });

    if (!deleteSchedule)
      return { success: false, error: 'Schedule section not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete schedule:', error);
    return { success: false, error: 'Failed to delete schedule section' };
  }
}

export async function getSchedules(): Promise<{
  success: boolean;
  schedules?: Schedule[];
  error?: string;
}> {
  try {
    const db = await getCollection('schedules');
    const schedules = await db.find({}).sort({ createdAt: -1 }).toArray();

    const processedSchedules = schedules.map((schedule) => ({
      _id: String(schedule._id),
      title: schedule.title,
      images: schedule.images,
      layout: schedule.layout,
      description: schedule.description,
      isVisible: schedule.isVisible,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    }));

    return { success: true, schedules: processedSchedules };
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return { success: false, error: 'Failed to fetch schedule sections' };
  }
}

export async function getVisibleSchedule() {
  try {
    const db = await getCollection('schedules');
    const schedule = await db.findOne<Schedule>({ isVisible: true });

    if (!schedule) return { success: true, schedule: null };

    return {
      success: true,
      schedule: {
        ...schedule,
        _id: String(schedule._id),
      },
    };
  } catch (error) {
    console.error('Failed to get visible schedule:', error);
    return { success: false, error: 'Failed to get visible schedule section' };
  }
}

export async function setVisibleSchedule(scheduleId: string) {
  try {
    if (!ObjectId.isValid(scheduleId))
      return { success: false, error: 'Invalid schedule ID' };

    const db = await getCollection('schedules');
    const schedule = await db.findOne({
      _id: new ObjectId(scheduleId),
    });

    if (!schedule)
      return { success: false, error: 'Schedule section not found' };

    const { client } = await connectToDatabase();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Hide all other schedule sections
        await db.updateMany(
          {},
          { $set: { isVisible: false, updatedAt: new Date() } },
          { session }
        );

        // Make this schedule section visible
        await db.updateOne(
          { _id: new ObjectId(scheduleId) },
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
    console.error('Failed to set visible schedule:', error);
    return { success: false, error: 'Failed to set visible schedule section' };
  }
}

export async function hideSchedule(scheduleId: string) {
  try {
    if (!ObjectId.isValid(scheduleId))
      return { success: false, error: 'Invalid schedule ID' };

    const db = await getCollection('schedules');
    const result = await db.updateOne(
      { _id: new ObjectId(scheduleId) },
      { $set: { isVisible: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0)
      return { success: false, error: 'Signup section not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to hide schedule:', error);
    return { success: false, error: 'Failed to hide schedule section' };
  }
}
