'use server';

import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';
import { getCollection, connectToDatabase } from '../client';
import { Announcement } from '../types';

export async function createAnnouncement(data: Partial<Announcement>) {
  try {
    if (data.mediaType === 'image' && !data.image) {
      return {
        success: false,
        error: 'Image is required when media type is image',
      };
    }

    if (data.mediaType === 'video' && !data.videoUrl?.trim()) {
      return {
        success: false,
        error: 'Video URL is required when media type is video',
      };
    }

    const db = await getCollection('announcements');

    const announcementData = {
      title: data.title?.trim() || undefined,
      description: data.description?.trim() || undefined,
      mediaType: data.mediaType || 'none',
      image: data.mediaType === 'image' ? data.image : null,
      videoUrl: data.mediaType === 'video' ? data.videoUrl?.trim() : undefined,
      isVisible: data.isVisible ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(announcementData);

    revalidatePath('/admin/homepage');

    return {
      success: true,
      announcement: {
        _id: String(result.insertedId),
        ...announcementData,
      },
    };
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return { success: false, error: 'Failed to create announcement' };
  }
}

export async function updateAnnouncement(
  announcementId: string,
  data: Partial<Announcement>
) {
  try {
    if (!ObjectId.isValid(announcementId))
      return { success: false, error: 'Invalid announcement ID' };

    if (data.mediaType === 'image' && !data.image) {
      return {
        success: false,
        error: 'Image is required when media type is image',
      };
    }

    if (data.mediaType === 'video' && !data.videoUrl?.trim()) {
      return {
        success: false,
        error: 'Video URL is required when media type is video',
      };
    }

    const db = await getCollection('announcements');

    const updateData = {
      title: data.title?.trim() || undefined,
      description: data.description?.trim() || undefined,
      mediaType: data.mediaType || 'none',
      image: data.mediaType === 'image' ? data.image : null,
      videoUrl: data.mediaType === 'video' ? data.videoUrl?.trim() : undefined,
      isVisible: data.isVisible ?? true,
      updatedAt: new Date(),
    };

    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(announcementId) },
      { $set: updateData }
    );

    if (!result) {
      return { success: false, error: 'Announcement not found' };
    }

    revalidatePath('/admin/homepage');

    return { success: true };
  } catch (error) {
    console.error('Failed to update announcement:', error);
    return { success: false, error: 'failed to update announcement' };
  }
}

export async function deleteAnnouncement(announcementId: string) {
  try {
    if (!ObjectId.isValid(announcementId))
      return { success: false, error: 'Invalid announcement ID' };

    const db = await getCollection('announcements');
    const deleteAnnouncement = await db.findOneAndDelete({
      _id: new ObjectId(announcementId),
    });

    if (!deleteAnnouncement)
      return { success: false, error: 'Announcement not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete announcement:', error);
    return { success: false, error: 'Failed to delete announcement' };
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const db = await getCollection('announcements');
    const announcements = await db.find({}).sort({ createdAt: -1 }).toArray();

    return announcements.map((announcement) => ({
      _id: String(announcement._id),
      title: announcement.title,
      description: announcement.description,
      mediaType: announcement.mediaType,
      image: announcement.image,
      videoUrl: announcement.videoUrl,
      isVisible: announcement.isVisible,
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return [];
  }
}

export async function getVisibleAnnouncement() {
  try {
    const db = await getCollection('announcements');
    const announcement = await db.findOne<Announcement>({ isVisible: true });

    if (!announcement) return { success: true, announcement: null };

    return {
      success: true,
      announcement: {
        ...announcement,
        _id: String(announcement._id),
      },
    };
  } catch (error) {
    console.error('Failed to get visible announcement:', error);
    return { success: false, error: 'Failed to get visible announcement' };
  }
}

export async function setVisibleAnnouncement(announcementId: string) {
  try {
    if (!ObjectId.isValid(announcementId))
      return { success: false, error: 'Invalid announcement ID' };

    const db = await getCollection('announcements');
    const announcement = await db.findOne({
      _id: new ObjectId(announcementId),
    });
    if (!announcement)
      return { success: false, error: 'Announcement not found' };
    const { client } = await connectToDatabase();
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        await db.updateMany(
          {},
          { $set: { isVisible: false, updatedAt: new Date() } },
          { session }
        );
        await db.updateOne(
          { _id: new ObjectId(announcementId) },
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
    console.error('Failed to set visible announcement:', error);
    return { success: false, error: 'Failed to set visible announcement' };
  }
}

export async function hideAnnouncement(announcementId: string) {
  try {
    if (!ObjectId.isValid(announcementId))
      return { success: false, error: 'Invalid announcement ID' };

    const db = await getCollection('announcements');
    const result = await db.updateOne(
      { _id: new ObjectId(announcementId) },
      { $set: { isVisible: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0)
      return { success: false, error: 'Announcement not found' };

    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to hide announcement:', error);
    return { success: false, error: 'Failed to hide announcement' };
  }
}
