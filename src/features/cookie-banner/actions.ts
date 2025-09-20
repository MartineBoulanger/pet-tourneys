'use server';

import { cookies } from 'next/headers';

const CONSENT_COOKIE_NAME = 'cookie_notice_seen';
const CONSENT_DURATION = 12 * 30 * 24 * 60 * 60 * 1000; // 12 months in milliseconds

export async function setCookieConsent() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CONSENT_COOKIE_NAME,
    value: 'true',
    maxAge: CONSENT_DURATION,
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}
