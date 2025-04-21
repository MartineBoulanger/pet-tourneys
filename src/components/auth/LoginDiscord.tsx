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
      className=' bg-blue-grey hover:bg-blue-grey/70 flex justify-center items-center gap-4'
      title='Login with Discord'
      aria-label='Login with Discord'
    >
      <FaDiscord className='text-foreground w-6 h-6' />
      <span className='text-foreground uppercase'>
        {isPending ? 'Redirecting...' : 'Login with Discord'}
      </span>
    </Button>
  );
};
