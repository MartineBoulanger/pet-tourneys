'use server';

import { partnersTable } from '@/actions/supabase/actions';
import { Partner } from '@/types/supabase.types';

// =================================================
// Get partners
// =================================================
export async function getPartners(): Promise<{
  success: boolean;
  data?: Partner[];
  error?: string;
}> {
  try {
    const partner = await partnersTable();

    const { data, error } = await partner
      .select('*')
      .order('createdat', { ascending: false });

    if (error)
      return {
        success: false,
        error: error.message || 'Partner not found',
      };

    const processedPartner = data?.map((p) => ({
      id: p.id,
      partner: p.partner,
      link: p.link,
      image: p.image as Partner['image'],
      createdat: new Date(p.createdat || '').toLocaleString(),
      updatedat: new Date(p.updatedat || '').toLocaleString(),
    }));

    return { success: true, data: processedPartner || [] };
  } catch (error) {
    console.error('Error fetching partners:', error);
    return { success: false, error: (error as Error).message };
  }
}
