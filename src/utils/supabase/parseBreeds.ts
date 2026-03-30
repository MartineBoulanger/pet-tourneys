import { ValidBreed, VALID_BREEDS } from '@/types/supabase.types';

// =================================================
// Helper function for the pets schema table
// - to validate breeds for the pets table
// =================================================
export function parseBreeds(breedsString: string): ValidBreed[] | null {
  if (!breedsString?.trim()) return null;

  const breeds = breedsString.split(',').map((b) => b.trim());
  const validBreeds = breeds.filter((breed): breed is ValidBreed =>
    VALID_BREEDS.includes(breed as ValidBreed),
  );

  return validBreeds.length > 0 ? validBreeds : null;
}
