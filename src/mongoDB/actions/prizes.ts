'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '../client';
import { Prize as PrizeType, MongoPrizeDocument } from '../types';
import { Prize } from '../models/Prize';
import { getImagesByIds } from './resources';

export async function createPrize(data: Partial<PrizeType>) {
  try {
    await dbConnect();
    if (!data.title?.trim() || !data.description?.trim())
      return { success: false, error: 'Title and Description are required' };
    const validImageIds =
      data.imageIds?.filter(
        (id) =>
          id && id.trim() !== '' && mongoose.Types.ObjectId.isValid(id.trim())
      ) || [];
    const lastPrize = await Prize.findOne().sort({ order: -1 });
    const nextOrder = (lastPrize?.order || 0) + 1;
    const prizeData = {
      title: data.title.trim(),
      description: data.description.trim(),
      isCarousel: data.isCarousel,
      isColumnLayout: data.isColumnLayout,
      imagePosition: data.imagePosition,
      textAlignment: data.textAlignment,
      imageIds: validImageIds,
      order: nextOrder,
    };
    const newPrize = new Prize(prizeData);
    const savedPrize = await newPrize.save();
    const result: PrizeType = {
      _id: String(savedPrize._id),
      title: savedPrize.title,
      description: savedPrize.description,
      isCarousel: savedPrize.isCarousel,
      isColumnLayout: savedPrize.isColumnLayout,
      imagePosition: savedPrize.imagePosition,
      textAlignment: savedPrize.textAlignment,
      imageIds: savedPrize.imageIds,
      videoUrl: savedPrize.videoUrl,
      order: savedPrize.order,
      createdAt: savedPrize.createdAt,
      updatedAt: savedPrize.updatedAt,
    };
    revalidatePath('/admin/prizes');
    return { success: true, prize: result };
  } catch (error) {
    console.error('Failed to create prize:', error);
    return { success: false, error: 'Failed to create prize' };
  }
}

export async function updatePrize(prizeId: string, data: Partial<PrizeType>) {
  try {
    await dbConnect();
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
    const updatedPrize = await Prize.findByIdAndUpdate(prizeId, prizeData, {
      new: true,
      runValidators: true,
    });
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
    return { success: false, error: 'Failed to update prize' };
  }
}

export async function deletePrize(prizeId: string) {
  try {
    await dbConnect();
    const deletePrize = await Prize.findByIdAndDelete(prizeId);
    if (!deletePrize) return { success: false, error: 'Prize not found' };
    revalidatePath('/admin/prizes');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete prize:', error);
    return { success: false, error: 'Failed to delete prize' };
  }
}

export async function getPrizes(): Promise<PrizeType[]> {
  try {
    await dbConnect();
    const prizes = await Prize.find().sort({ order: 1 }).lean();
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
    await dbConnect();
    const prize = await Prize.findById(prizeId).lean();
    if (!prize) return null;
    return {
      _id: (prize as MongoPrizeDocument)._id.toString(),
      title: (prize as MongoPrizeDocument).title,
      description: (prize as MongoPrizeDocument).description,
      isCarousel: (prize as MongoPrizeDocument).isCarousel,
      isColumnLayout: (prize as MongoPrizeDocument).isColumnLayout,
      imagePosition: (prize as MongoPrizeDocument).imagePosition,
      textAlignment: (prize as MongoPrizeDocument).textAlignment,
      imageIds: (prize as MongoPrizeDocument).imageIds?.map((id: string) =>
        id.toString()
      ),
      videoUrl: (prize as MongoPrizeDocument).videoUrl,
      order: (prize as MongoPrizeDocument).order,
      createdAt: (prize as MongoPrizeDocument).createdAt,
      updatedAt: (prize as MongoPrizeDocument).updatedAt,
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
    await dbConnect();
    await Prize.findByIdAndUpdate(prizeId, { order: newOrder });
    revalidatePath('/admin/prizes');
    return { success: true };
  } catch (error) {
    console.error('Failed to update prize order:', error);
    return {
      success: false,
      error: 'Failed to update the order of the prizes',
    };
  }
}

export async function reorderPrizes(prizeIds: string[]) {
  try {
    await dbConnect();
    const updatePromises = prizeIds.map((id, index) =>
      Prize.findByIdAndUpdate(id, { order: index + 1 })
    );
    await Promise.all(updatePromises);
    revalidatePath('/admin/prizes');
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder prizes:', error);
    return { success: false, error: 'Failed to reorder the prizes' };
  }
}
