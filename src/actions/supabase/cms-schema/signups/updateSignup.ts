'use server';

import { revalidatePath } from 'next/cache';
import { signupsTable } from '@/actions/supabase/actions';
import { Signup } from '@/types/supabase.types';

// =================================================
// Update signup
// =================================================
export async function updateSignup(id: string, data: Partial<Signup>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    // validate that we have at least 1 image
    if (!data.images || data.images.length === 0)
      return { success: false, error: 'At least one signup item is required' };

    // validate each image has required fields
    for (const image of data.images) {
      if (!image.image || !image.imageName?.trim())
        return {
          success: false,
          error: 'All signup items must have an image and an image name',
        };
    }

    const cms = await signupsTable();

    // process images to ensure proper order
    const processedImages = data.images.map((image, index) => ({
      image: image.image || null,
      imageName: image.imageName?.trim(),
      imageAlt: image.imageAlt?.trim() || '',
      signupUrl: image.signupUrl?.trim() || '',
      order: image.order || index + 1,
    }));

    const updateData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      isvisible: data.isvisible ?? true,
      updatedat: new Date().toISOString(),
    };

    const { error } = await cms.update(updateData).eq('id', id);

    if (error)
      return { success: false, error: error.message || 'Signup not found' };

    revalidatePath('/admin-panel/content/signups');

    return { success: true };
  } catch (error) {
    console.error('Error updating signup:', error);
    return { success: false, error: (error as Error).message };
  }
}
