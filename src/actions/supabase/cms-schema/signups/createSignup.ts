'use server';

import { revalidatePath } from 'next/cache';
import { signupsTable } from '@/actions/supabase/actions';
import { Signup } from '@/types/supabase.types';

// =================================================
// Create signup
// =================================================
export async function createSignup(data: Partial<Signup>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };
    if (!data.images || data.images.length === 0)
      return { success: false, error: 'At least one signup item is required' };

    // validating each image has required fields
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
      imageName: image.imageName.trim(),
      imageAlt: image.imageAlt?.trim() || '',
      signupUrl: image.signupUrl?.trim() || '',
      order: image.order || index + 1, // default order based on index if not provided
    }));

    const signupData = {
      title: data.title?.trim() || '',
      images: processedImages,
      layout: data.layout || '3',
      isvisible: data.isvisible ?? true,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await cms
      .insert(signupData)
      .select('*')
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Signup not created',
      };

    revalidatePath('/admin-panel/content/signups');

    return {
      success: true,
      signup: {
        id: result?.id || '',
        title: result?.title || signupData.title || '',
        layout: result?.layout || signupData.layout || '3',
        images: result?.images || signupData.images || [],
        isvisible: result?.isvisible ?? signupData.isvisible ?? true,
        createdat: new Date(
          result?.createdat || signupData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || signupData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating signup:', error);
    return { success: false, error: (error as Error).message };
  }
}
