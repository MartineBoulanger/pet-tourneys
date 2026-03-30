'use server';

import { type EmailOtpType } from '@supabase/supabase-js';
import { sbServer } from '@/lib/supabase/server';

// ==================================================
// Authentication Functions
// ==================================================
export const changeCode = async (code: string) => {
  const supabase = await sbServer();
  return supabase.auth.exchangeCodeForSession(code);
};

export const verifyOtp = async (type: EmailOtpType, token_hash: string) => {
  const supabase = await sbServer();
  return supabase.auth.verifyOtp({ type, token_hash });
};

export const getUser = async () => {
  const supabase = await sbServer();
  return supabase.auth.getUser();
};
