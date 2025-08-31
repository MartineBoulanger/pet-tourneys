'use server';

import { revalidatePath } from 'next/cache';
import { BASE } from '../types';

// --- Delete ---
export async function deleteImage(id: string) {
  try {
    const res = await fetch(`${BASE}/api/images/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Delete failed:', res.status, errorText);
      throw new Error(`Delete failed: ${res.status}`);
    }

    const result = (await res.json()) as { ok: boolean; id: string };
    revalidatePath('/admin/images');
    return result;
  } catch (error) {
    console.error('deleteImage error:', error);
    throw error;
  }
}
