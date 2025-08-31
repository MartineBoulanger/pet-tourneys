'use server';

import { revalidatePath } from 'next/cache';
import { ImageRecord, BASE } from '../types';

// --- Update ---
export async function updateImage(
  id: string,
  patch: Partial<Pick<ImageRecord, 'title' | 'alt' | 'tags' | 'custom'>>
) {
  try {
    const res = await fetch(`${BASE}/api/images/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(patch),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Update failed:', res.status, errorText);
      throw new Error(`Update failed: ${res.status}`);
    }
    const updated = (await res.json()) as ImageRecord;
    revalidatePath('/admin/images');
    return updated;
  } catch (error) {
    console.error('updateImage error:', error);
    throw error;
  }
}
