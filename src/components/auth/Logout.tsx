'use client';
import { useTransition } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { signOut } from '@/actions/supabase/api-schema/auth/signOut';
import { Button } from '@/components/ui';

export const Logout = ({ className }: { className?: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <Button
      type='button'
      variant='link'
      disabled={isPending}
      className={className}
      onClick={handleLogout}
      title='Logout'
      aria-label='Logout'
    >
      {isPending ? '...' : <BiLogOut className='h-6 w-6' />}
    </Button>
  );
};
