'use server';

import { revalidatePath } from 'next/cache';
import { schedulesTable } from '@/actions/supabase/actions';
import { Schedule } from '@/types/supabase.types';

// =================================================
// Update schedule
// =================================================
export async function updateSchedule(id: string, data: Partial<Schedule>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    // validate that we have at least 1 image
    if (!data.images || data.images.length === 0)
      return {
        success: false,
        error: 'At least one schedule item is required',
      };

    // validate each image has required fields
    for (const image of data.images) {
      if (!image.image || !image.imageName?.trim())
        return {
          success: false,
          error: 'All schedule items must have an image and an image name',
        };
    }

    const cms = await schedulesTable();

    // process images to ensure proper order
    const processedImages = data.images.map((image, index) => ({
      image: image.image || null,
      imageName: image.imageName?.trim(),
      imageDate: image.imageDate?.trim() || '',
      order: image.order || index + 1,
    }));

    const updateData = {
      title: data.title?.trim() || '',
      description: data.description?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      isvisible: data.isvisible ?? true,
      updatedat: new Date().toISOString(),
    };

    const { error } = await cms.update(updateData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Schedule not found' };

    revalidatePath('/admin-panel/content/schedules');

    return { success: true };
  } catch (error) {
    console.error('Error updating schedule:', error);
    return { success: false, error: (error as Error).message };
  }
}
