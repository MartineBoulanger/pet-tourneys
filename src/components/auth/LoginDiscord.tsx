'use client';

import { useTransition } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { signInWithDiscord } from '@/supabase/actions/auth';
import { Button } from '@/components/ui';

export const LoginDiscord = () => {
  const [isPending, startTransition] = useTransition();

  const handleDiscordLogin = () => {
    startTransition(async () => {
      await signInWithDiscord();
    });
  };

  return (
    <Button
      type='button'
      onClick={handleDiscordLogin}
      className='flex justify-center items-center gap-2.5 lg:gap-5'
      title='Login with Discord'
      aria-label='Login with Discord'
    >
      <FaDiscord className='w-6 h-6' />
      <span>{isPending ? 'Redirecting...' : 'Login with Discord'}</span>
    </Button>
  );
};