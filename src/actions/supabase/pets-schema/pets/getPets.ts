'use server';

import { petsTable } from '@/actions/supabase/actions';
import { Pet } from '@/types/supabase.types';
import { parseCloudinaryImage } from '@/utils/supabase/parseCloudinaryImage';
import { revalidatePath } from 'next/cache';

// =================================================
// Get paginated pets
// =================================================
export const getPets = async (
  page: number = 1,
  pageSize: number = 20,
  path: string = '',
) => {
  try {
    const pets = await petsTable();

    // Calculate range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get paginated data and total count
    const { data, error, count } = await pets
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath(path);

    return {
      success: true,
      data: data as Pet[],
      count: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Get pets by names
// - used for player rankings
// =================================================
export const getPetsByNames = async (allPetNames: string[]) => {
  try {
    const pets = await petsTable();

    const { data, error } = await pets.select('*').in('name', allPetNames);

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as Pet[],
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Get all pets
// =================================================
export const getAllPets = async () => {
  try {
    const pets = await petsTable();
    const pageSize = 1000;
    let allData: Pet[] = [];
    let from = 0;
    let hasMore = true;

    // Get all pets
    while (hasMore) {
      const { data, error } = await pets
        .select('*')
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Supabase error:', error);
        return { success: false, error: error.message };
      }

      allData = [...allData, ...(data as Pet[])];
      hasMore = data.length === pageSize;
      from += pageSize;
    }

    return {
      success: true,
      data: allData,
      count: allData.length,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// =================================================
// Get a single pet
// =================================================
export async function getPet(id: number) {
  try {
    const pets = await petsTable();
    const { data, error } = await pets.select('*').eq('id', id).single();

    if (error) return { success: false, error: error.message };

    // Transform the data to match the Pet type with proper CloudinaryImage objects
    const transformedData = data
      ? {
          ...data,
          icon: parseCloudinaryImage(data.icon),
          image: parseCloudinaryImage(data.image),
        }
      : null;

    return { success: true, data: transformedData as Pet };
  } catch (error) {
    console.error('Get Pet Error:', error);
    return { success: false, error: (error as Error).message };
  }
}
