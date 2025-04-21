'use client';

import { useTransition } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { signInWithDiscord } from '@/supabase/actions/auth';

export const LoginDiscord = () => {
  const [isPending, startTransition] = useTransition();

  const handleDiscordLogin = () => {
    startTransition(async () => {
      await signInWithDiscord();
    });
  };

  return (
    <button
      type='button'
      onClick={handleDiscordLogin}
      className='btn-submit rounded-lg gap-4 h-12 bg-blue-grey hover:bg-blue-grey/70 p-4 flex justify-center items-center'
      title='Login with Discord'
      aria-label='Login with Discord'
    >
      <FaDiscord className='text-foreground w-6 h-6' />
      <span className='text-foreground uppercase'>
        {isPending ? 'Redirecting...' : 'Login with Discord'}
      </span>
    </button>
  );
};
