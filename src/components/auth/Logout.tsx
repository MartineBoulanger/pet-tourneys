'use client';
import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { signOut } from '@/supabase/actions/auth';
import { Button } from '@/components/ui';

export const Logout = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <Button
      type='button'
      variant='link'
      disabled={loading}
      className={className}
      onClick={handleLogout}
      title='Logout'
      aria-label='Logout'
    >
      {loading ? '...' : <BiLogOut className='h-6 w-6' />}
    </Button>
  );
};
