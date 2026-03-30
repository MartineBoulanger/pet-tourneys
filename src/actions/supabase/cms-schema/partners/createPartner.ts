'use server';

import { revalidatePath } from 'next/cache';
import { partnersTable } from '@/actions/supabase/actions';
import { Partner } from '@/types/supabase.types';

// =================================================
// Create partner
// =================================================
export async function createPartner(data: Partial<Partner>) {
  try {
    if (!data.partner?.trim() || !data.link?.trim() || !data.image)
      return {
        success: false,
        error: 'Partner name, link, and image are required.',
      };

    const partner = await partnersTable();

    const partnerData = {
      partner: data.partner.trim(),
      link: data.link.trim(),
      image: data.image,
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    };

    const { data: result, error } = await partner
      .insert(partnerData)
      .select('*')
      .single();

    if (error)
      return {
        success: false,
        error: error.message || 'Partner not found',
      };

    revalidatePath('/admin-panel/content/partners');

    return {
      success: true,
      hofItem: {
        id: result?.id || '',
        partner: result?.partner || partnerData.partner || '',
        link: result?.link || partnerData.link || '',
        image: result?.image || partnerData.image || null,
        createdat: new Date(
          result?.createdat || partnerData.createdat,
        ).toISOString(),
        updatedat: new Date(
          result?.updatedat || partnerData.updatedat,
        ).toISOString(),
      },
    };
  } catch (error) {
    console.error('Error creating partner:', error);
    return { success: false, error: (error as Error).message };
  }
}
