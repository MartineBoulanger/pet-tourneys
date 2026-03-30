'use server';

import { revalidatePath } from 'next/cache';
import { petsTable } from '@/actions/supabase/actions';
import { PetData } from '@/types/supabase.types';

// =================================================
// Update an existing pet
// =================================================
export async function updatePet(data: PetData, path: string) {
  try {
    const pets = await petsTable();

    // Remove id from update data since we're using it in the eq filter
    const { id, ...updateData } = data;

    // Convert CloudinaryImage objects to JSON for Supabase
    const dbUpdateData = {
      ...updateData,
      icon: updateData.icon
        ? JSON.parse(JSON.stringify(updateData.icon))
        : null,
      image: updateData.image
        ? JSON.parse(JSON.stringify(updateData.image))
        : null,
    };

    const { error } = await pets.update(dbUpdateData).eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Update Pet Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
