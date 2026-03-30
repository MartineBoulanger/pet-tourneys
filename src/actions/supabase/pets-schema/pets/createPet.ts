'use server';

import { revalidatePath } from 'next/cache';
import { petsTable } from '@/actions/supabase/actions';
import {
  PetBreed,
  PetSource,
  PetExpansion,
  PetType,
  PetData,
  ExcelPetRow,
  UpdateMode,
} from '@/types/supabase.types';
import { parseBreeds } from '@/utils/supabase/parseBreeds';
import { getImagesByUrls } from '@/actions/cloudinary/getImages';

// =================================================
// Create a new pet
// =================================================
export async function createPet(data: PetData, path: string) {
  try {
    const pets = await petsTable();

    // check if the pet id already exists
    const { data: existing } = await pets
      .select('id')
      .eq('id', data.id)
      .single();

    if (existing)
      return { success: false, error: `Pet with ID ${data.id} already exists` };

    const { error } = await pets.insert(data);
    if (error) return { success: false, error: error.message };

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Create Pet Error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// =================================================
// Create pets in bulk
// =================================================
export async function createPetsInBulk(
  rows: ExcelPetRow[],
  updateMode: UpdateMode,
  path: string,
) {
  try {
    const pets = await petsTable();

    // Collect all image URLs
    const allImageUrls = rows
      .flatMap((row) => [row.Icon, row.Image])
      .filter(Boolean);

    // Fetch all Cloudinary images in one batch
    const imageMap = await getImagesByUrls(allImageUrls, [
      'pml-pet-icons',
      'pml-pet-images',
    ]);

    // Get existing pets to check for duplicates
    const { data: existingPets } = await pets.select('id, name, ability_1');
    const existingPetIds = new Set(existingPets?.map((p) => p.id) || []);

    // Create a map for faster lookup
    const existingPetsMap = new Map(existingPets?.map((p) => [p.id, p]) || []);

    const results = {
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Process each pet
    for (const row of rows) {
      try {
        const petId = parseInt(row['Pet ID']);

        if (isNaN(petId) || !row.Name?.trim()) {
          results.errors.push(
            `Row with Pet ID ${row['Pet ID'] || 'unknown'} is missing required fields`,
          );
          continue;
        }

        const petExists = existingPetIds.has(petId);

        // Handle based on update mode
        if (petExists) {
          if (updateMode === 'skip') {
            results.skipped++;
            continue;
          }

          // Check if pet has complete data
          const existingPet = existingPetsMap.get(petId);
          const hasIncompleteData = !existingPet?.ability_1; // Simple check, adjust as needed

          if (updateMode === 'update' && !hasIncompleteData) {
            results.skipped++;
            continue;
          }
        }

        // Get images from map
        const iconImage = row.Icon ? imageMap.get(row.Icon) : null;
        const petImage = row.Image ? imageMap.get(row.Image) : null;

        // Log missing images (but don't fail)
        if (row.Icon && !iconImage) {
          console.warn(
            `Pet ${petId}: Icon URL not found in Cloudinary - ${row.Icon}`,
          );
        }
        if (row.Image && !petImage) {
          console.warn(
            `Pet ${petId}: Image URL not found in Cloudinary - ${row.Image}`,
          );
        }

        // Parse the row into pet data
        const petData = {
          id: petId,
          name: row.Name.trim(),
          type: (row.Type.trim() as PetType) || 'Beast',
          expansion: (row.Expansion.trim() as PetExpansion) || 'Classic',
          is_tradable: row.Tradable?.toLowerCase() === 'yes',
          is_capturable: row.Capturable?.toLowerCase() === 'yes',
          is_vanity: row.Vanity?.toLowerCase() === 'yes',
          is_horde: row['Horde Only']?.trim()?.toLowerCase() === 'yes',
          is_alliance: row['Alliance Only']?.trim()?.toLowerCase() === 'yes',
          ability_1: row['Ability 1']?.trim() || null,
          ability_2: row['Ability 2']?.trim() || null,
          ability_3: row['Ability 3']?.trim() || null,
          ability_4: row['Ability 4']?.trim() || null,
          ability_5: row['Ability 5']?.trim() || null,
          ability_6: row['Ability 6']?.trim() || null,
          base_health:
            parseFloat(row['Base Health']?.replace(',', '.')) || null,
          base_power: parseFloat(row['Base Power']?.replace(',', '.')) || null,
          base_speed: parseFloat(row['Base Speed']?.replace(',', '.')) || null,
          breeds: parseBreeds(row['Available Breeds']) as PetBreed[] | null,
          source: (row.Source?.trim() as PetSource) || null,
          description: row.Description?.trim() || null,
          icon: iconImage,
          image: petImage,
        };

        // Insert or update
        if (petExists) {
          const { error } = await pets.update(petData).eq('id', petId);

          if (error) {
            results.errors.push(
              `Failed to update pet ${petId}: ${error.message}`,
            );
          } else {
            results.updated++;
          }
        } else {
          const { error } = await pets.insert(petData);

          if (error) {
            results.errors.push(
              `Failed to create pet ${petId}: ${error.message}`,
            );
          } else {
            results.created++;
          }
        }
      } catch (error) {
        results.errors.push(
          `Error processing pet ${row['Pet ID']}: ${(error as Error).message}`,
        );
      }
    }

    // Revalidate path after ALL pets are processed
    revalidatePath(path);

    return { success: true, results };
  } catch (error) {
    console.error('Bulk upload error:', error);
    return { success: false, error: (error as Error).message };
  }
}
