'use server';

import { revalidatePath } from 'next/cache';
import { petsTable } from '@/actions/supabase/actions';
import { Pet } from '@/types/supabase.types';
import { fetchAllTableRows } from '@/utils/supabase/fetchAllTableRows';
import { parseCloudinaryImage } from '@/utils/supabase/parseCloudinaryImage';

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

    const allData = await fetchAllTableRows<Pet>(async (from, to) => {
      const { data, error } = await pets
        .select('*')
        .order('id', { ascending: true })
        .range(from, to);
      return { data: data as Pet[] | null, error };
    });

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

// =================================================
// Get pet types by species IDs
// - used for leveling queue import
// =================================================

enum PET_TYPES {
  HUMANOID = 1,
  DRAGONKIN = 2,
  FLYING = 3,
  UNDEAD = 4,
  CRITTER = 5,
  MAGIC = 6,
  ELEMENTAL = 7,
  BEAST = 8,
  AQUATIC = 9,
  MECHANICAL = 10,
}

export const getPetTypesBySpeciesIds = async (speciesIds: number[]) => {
  try {
    const uniqueSpeciesIds = [...new Set(speciesIds)];

    if (!uniqueSpeciesIds.length) {
      return {
        success: true,
        data: {} as Record<number, number>,
      };
    }

    const pets = await petsTable();

    const { data, error } = await pets
      .select('id, type')
      .in('id', uniqueSpeciesIds);

    if (error) {
      console.error('Supabase error:', error);

      return {
        success: false,
        error: error.message,
      };
    }

    const petTypes: Record<number, number> = {};

    for (const pet of data ?? []) {
      const key = pet.type.toUpperCase() as keyof typeof PET_TYPES;
      const type = PET_TYPES[key];
      petTypes[pet.id] = type;
    }

    return {
      success: true,
      data: petTypes,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
