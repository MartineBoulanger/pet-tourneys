'use server';

import { revalidatePath } from 'next/cache';
import { partnersTable } from '@/actions/supabase/actions';
import { Partner } from '@/types/supabase.types';

// =================================================
// Update partner
// =================================================
export async function updatePartner(id: string, data: Partial<Partner>) {
  try {
    if (!id) return { success: false, error: 'ID is required' };

    if (!data.partner?.trim() || !data.link?.trim() || !data.image)
      return {
        success: false,
        error: 'Partner name, link, and image are required.',
      };

    const partner = await partnersTable();

    const partnerData = {
      partner: data.partner,
      link: data.link,
      image: data.image,
      updatedat: new Date().toISOString(),
    };

    const { error } = await partner.update(partnerData).eq('id', id);

    if (error)
      return {
        success: false,
        error: error.message || 'Partner not found',
      };

    revalidatePath('/admin-panel/content/partners');

    return { success: true };
  } catch (error) {
    console.error('Error updating partner:', error);
    return { success: false, error: (error as Error).message };
  }
}
