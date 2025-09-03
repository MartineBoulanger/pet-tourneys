'use client';

import { CookieBotBodyScript } from '@/components/scripts/CookieBot';
import { Container, Heading } from '@/components/ui';

export default function CookiesPage() {
  return (
    <Container className='py-10'>
      <Heading>{'Cookie Declaration'}</Heading>
      <div id='cookie-declaration' />
      <CookieBotBodyScript />
    </Container>
  );
}
