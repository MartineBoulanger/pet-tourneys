'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import { Prize as PrizeType } from '../types';
import { getImagesByIds } from './resources';

export async function createPrize(data: Partial<PrizeType>) {
  try {
    if (!data.title?.trim() || !data.description?.trim())
      return { success: false, error: 'Title and Description are required' };

    const db = await getCollection('prizes');
    const lastPrize = await db.find({}).sort({ order: -1 }).limit(1).toArray();

    const nextOrder = lastPrize.length > 0 ? lastPrize[0].order + 1 : 1;

    const validImageIds =
      data.imageIds?.filter(
        (id) => id && id.trim() !== '' && ObjectId.isValid(id.trim())
      ) || [];

    const prizeData = {
      title: data.title.trim(),
      description: data.description.trim(),
      isCarousel: data.isCarousel,
      isColumnLayout: data.isColumnLayout,
      imagePosition: data.imagePosition,
      textAlignment: data.textAlignment,
      imageIds: validImageIds,
      videoUrl: data.videoUrl,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(prizeData);

    revalidatePath('/admin/prizes');

    return {
      success: true,
      prize: {
        _id: String(result.insertedId),
        ...prizeData,
        imageIds: validImageIds.map((id) => id.toString()),
      },
    };
  } catch (error) {
    console.error('Failed to create prize:', error);
    return { success: false, error: 'Failed to create prize' };
  }
}

export async function updatePrize(prizeId: string, data: Partial<PrizeType>) {
  try {
    if (!data.title?.trim() || !data.description?.trim())
      return { success: false, error: 'Title and Description are required' };

    const cleanImageIds = data.imageIds
      ?.filter((id) => id && typeof id === 'string' && id.trim() !== '')
      .map((id) => id.trim());

    const prizeData = {
      title: data.title.trim(),
      description: data.description.trim(),
      isCarousel: data.isCarousel,
      isColumnLayout: data.isColumnLayout,
      imagePosition: data.imagePosition,
      textAlignment: data.textAlignment,
      imageIds: cleanImageIds,
      videoUrl: data.videoUrl,
      updatedAt: data.updatedAt,
    };

    const db = await getCollection('prizes');
    const updatedPrize = await db.findOneAndUpdate(
      { _id: new ObjectId(prizeId) },
      { $set: prizeData },
      { returnDocument: 'after' }
    );

    if (!updatedPrize) return { success: false, error: 'Prize not found' };

    const result: PrizeType = {
      _id: String(updatedPrize._id),
      title: updatedPrize.title,
      description: updatedPrize.description,
      isCarousel: updatedPrize.isCarousel,
      isColumnLayout: updatedPrize.isColumnLayout,
      imagePosition: updatedPrize.imagePosition,
      textAlignment: updatedPrize.textAlignment,
      imageIds: updatedPrize.imageIds,
      videoUrl: updatedPrize.videoUrl,
      order: updatedPrize.order,
      createdAt: updatedPrize.createdAt,
      updatedAt: updatedPrize.updatedAt,
    };

    revalidatePath('/admin/prizes');

    return { success: true, prize: result };
  } catch (error) {
    console.error('Failed to update prize:', error);
    return { success: false, error: `Failed to update prize: ${error}` };
  }
}

export async function deletePrize(prizeId: string) {
  try {
    const db = await getCollection('prizes');
    const deletePrize = await db.findOneAndDelete({
      _id: new ObjectId(prizeId),
    });

    if (!deletePrize) return { success: false, error: 'Prize not found' };

    revalidatePath('/admin/prizes');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete prize:', error);
    return { success: false, error: `Failed to delete prize: ${error}` };
  }
}

export async function getPrizes(): Promise<PrizeType[]> {
  try {
    const db = await getCollection('prizes');
    const prizes = await db.find({}).sort({ order: 1 }).toArray();

    return prizes.map((prize) => ({
      _id: String(prize._id),
      title: prize.title,
      description: prize.description,
      isCarousel: prize.isCarousel,
      isColumnLayout: prize.isColumnLayout,
      imagePosition: prize.imagePosition,
      textAlignment: prize.textAlignment,
      imageIds: prize.imageIds.map((id: string) => id.toString()),
      videoUrl: prize.videoUrl,
      order: prize.order,
      createdAt: prize.createdAt,
      updatedAt: prize.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to fetch prizes:', error);
    return [];
  }
}

export async function getPrize(prizeId: string): Promise<PrizeType | null> {
  try {
    const db = await getCollection('prizes');
    const prize = await db.findOne({
      _id: new ObjectId(prizeId),
    });

    if (!prize) return null;

    return {
      _id: String(prize._id),
      title: prize.title,
      description: prize.description,
      isCarousel: prize.isCarousel,
      isColumnLayout: prize.isColumnLayout,
      imagePosition: prize.imagePosition,
      textAlignment: prize.textAlignment,
      imageIds: prize.imageIds?.map((id: string) => id.toString()),
      videoUrl: prize.videoUrl,
      order: prize.order,
      createdAt: prize.createdAt,
      updatedAt: prize.updatedAt,
    };
  } catch (error) {
    console.error('Failed to fetch prize:', error);
    return null;
  }
}

export async function getPrizesWithImages() {
  try {
    const prizes = await getPrizes();

    const prizesWithImages = await Promise.all(
      prizes.map(async (prize) => {
        const ids = prize.imageIds?.length ? prize.imageIds : [];
        const images = await getImagesByIds(ids);
        return { ...prize, images };
      })
    );

    return prizesWithImages;
  } catch (error) {
    console.error('Error fetching prizes with images:', error);
    return [];
  }
}

export async function updatePrizeOrder(prizeId: string, newOrder: number) {
  try {
    const db = await getCollection('prizes');
    await db.findOneAndUpdate(
      { _id: new ObjectId(prizeId) },
      { $set: { order: newOrder } },
      { returnDocument: 'after' }
    );

    revalidatePath('/admin/prizes');

    return { success: true };
  } catch (error) {
    console.error('Failed to update prize order:', error);
    return {
      success: false,
      error: `Failed to update the order of the prizes: ${error}`,
    };
  }
}

export async function reorderPrizes(prizeIds: string[]) {
  try {
    // Create bulk write operations for efficient updating
    const bulkOps = prizeIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1, updatedAt: new Date() } },
      },
    }));

    // Execute all updates in a single operation
    const db = await getCollection('prizes');
    const result = await db.bulkWrite(bulkOps);

    revalidatePath('/admin/prizes');

    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Failed to reorder prizes:', error);
    return { success: false, error: `Failed to reorder the prizes: ${error}` };
  }
}
