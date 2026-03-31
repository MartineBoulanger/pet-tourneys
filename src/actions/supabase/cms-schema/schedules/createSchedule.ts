'use server';

import { revalidatePath } from 'next/cache';
import { schedulesTable } from '@/actions/supabase/actions';
import { Schedule } from '@/types/supabase.types';

// =================================================
// Create schedule
// =================================================
export async function createSchedule(data: Partial<Schedule>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };

    if (!data.images || data.images.length === 0)
      return {
        success: false,
        error: 'At least one schedule item is required',
      };

    // validating each image
    for (const image of data.images) {
      if (!image.image || !image.imageName?.trim())
        return {
          success: false,
          error: 'All schedule items must have an image',
        };
    }

    const cms = await schedulesTable();

    // process images
    const processedImages = data.images.map((image, index) => ({
      image: image.image || null,
      imageName: image.imageName.trim(),
      imageDate: image.imageDate.trim() || '',
      order: image.order || index + 1, // default order based on index if not provided
    }));

    const scheduleData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      description: data.description?.trim() || '',
      isvisible: data.isvisible || true,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await cms
      .insert(scheduleData)
      .select('*')
      .single();

    if (error)
      return { success: false, error: error.message || 'Schedule not created' };

    revalidatePath('/admin-panel      /content/schedules');

    return {
      success: true,
      data: {
        id: result?.id || '',
        title: result?.title || scheduleData.title || '',
        description: result?.description || scheduleData.description || '',
        layout: result?.layout || scheduleData.layout || '3',
        images: result?.images || scheduleData.images || [],
        isvisible: result?.isvisible ?? scheduleData.isvisible ?? true,
        createdat: new Date(
          result?.createdat || scheduleData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || scheduleData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating schedule:', error);
    return { success: false, error: (error as Error).message };
  }
}
