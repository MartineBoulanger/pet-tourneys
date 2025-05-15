'use client';

import { AnalyzeToolFormSkeleton, Container } from '@/components/ui';

export default function Loading() {
  return (
    <Container>
      <h1 className='h-20 bg-foreground/80 animate-pulse w-1/2 mx-auto'></h1>
      <p className='h-3 bg-foreground/80 animate-pulse w-1/2 mx-auto'></p>
      <p className='h-3 bg-foreground/80 animate-pulse w-1/2 mx-auto'></p>
      <AnalyzeToolFormSkeleton />
    </Container>
  );
}

// TODO: check why this loading page is not showing -> also make a loading.tsx for all pages that uses data from either supabase or contentful -> so people do not have to wait too long
