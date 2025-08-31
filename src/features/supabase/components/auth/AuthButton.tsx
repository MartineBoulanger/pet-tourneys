import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

interface AuthButtonProps {
  type: 'login' | 'Sign up' | 'Reset Password' | 'Forgot Password';
  loading: boolean;
  className?: string;
}

export const AuthButton = ({ type, loading, className }: AuthButtonProps) => {
  return (
    <Button
      disabled={loading}
      type='submit'
      className={cn('w-full', className)}
      title={type}
      aria-label={type}
    >
      {loading ? 'Loading...' : type}
    </Button>
  );
};
