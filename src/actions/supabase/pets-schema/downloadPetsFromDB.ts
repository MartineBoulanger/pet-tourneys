'use server';

import { petsTable } from '@/actions/supabase/actions';
import { Pet } from '@/types/supabase.types';

export async function downloadPetsFromDB() {
  try {
    const pets = await petsTable();
    const pageSize = 1000;
    let allData: Pet[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await pets
        .select('*')
        .order('id', { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        console.error('Supabase error:', error);
        return { error: error.message };
      }

      allData = [...allData, ...(data as Pet[])];
      hasMore = data.length === pageSize;
      from += pageSize;
    }

    return { data: allData };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
