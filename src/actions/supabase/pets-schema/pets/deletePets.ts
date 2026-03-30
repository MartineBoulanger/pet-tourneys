'use server';

import { petsTable } from '@/actions/supabase/actions';
import { revalidatePath } from 'next/cache';

// =================================================
// Delete a pet
// =================================================
export const deletePet = async (petId: number, path: string) => {
  try {
    const pets = await petsTable();
    const { error } = await pets.delete().eq('id', petId);
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Delete multiple pets
// =================================================
export const deletePets = async (petIds: number[], path: string) => {
  try {
    const pets = await petsTable();
    const { error } = await pets.delete().in('id', petIds);
    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
