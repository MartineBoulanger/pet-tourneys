'use server';

import { petsTable } from '@/actions/supabase/actions';
import { Pet } from '@/types/supabase.types';
import { fetchAllTableRows } from '@/utils/supabase/fetchAllTableRows';

export async function downloadPetsFromDB() {
  try {
    const pets = await petsTable();

    const allData = await fetchAllTableRows<Pet>(async (from, to) => {
      const { data, error } = await pets
        .select('*')
        .order('id', { ascending: true })
        .range(from, to);
      return { data: data as Pet[] | null, error };
    });

    return { data: allData };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
