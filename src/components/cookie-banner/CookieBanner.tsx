'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heading, Paragraph, Button } from '@/components/ui';
import { setCookieConsent } from '@/actions/setCookie';

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  const hasSeen = document.cookie.includes('cookie_notice_seen=true');

  if (dismissed || hasSeen) return null;

  async function handleOk() {
    await setCookieConsent();
    setDismissed(true);
  }

  return (
    <div className='fixed bottom-5 left-5 right-5 max-w-screen-md mx-auto bg-dark-grey shadow-md p-5 rounded-lg flex justify-between z-[999]'>
      <div>
        <Heading as='h2' className='mb-2'>
          {'Cookies notice'}
        </Heading>
        <Paragraph className='text-sm'>
          {'We only use cookies that are strictly necessary :'}
        </Paragraph>
        <Paragraph className='text-sm'>
          {
            '– Authentication cookies, which keep you securely logged in and are removed when you log out.'
          }
        </Paragraph>
        <Paragraph className='text-sm'>
          {
            '– A functional cookie that remembers you’ve dismissed this notice (valid for 1 year).'
          }
        </Paragraph>
        <Paragraph className='text-sm mb-2'>
          {
            '– Functional cookies to be able to show the images on the website as they come from an images provider.'
          }
        </Paragraph>
        <Paragraph className='text-sm'>
          {'We do not use tracking or marketing cookies.'}
        </Paragraph>
        <Paragraph className='text-sm'>
          {'See our '}
          <Link href='/cookies-policy' className='underline text-light-blue'>
            {'Cookies Policy'}
          </Link>
          {' for details.'}
        </Paragraph>
      </div>
      <Button type='button' onClick={handleOk} className='mt-3 self-end'>
        {'OK'}
      </Button>
    </div>
  );
}
