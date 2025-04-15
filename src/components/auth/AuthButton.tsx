import React from 'react';
import { cn } from '@/utils/cn';

export const AuthButton = ({
  type,
  loading,
  className,
}: {
  type: 'login' | 'Sign up' | 'Reset Password' | 'Forgot Password';
  loading: boolean;
  className?: string;
}) => {
  return (
    <button
      disabled={loading}
      type='submit'
      className={cn('btn-submit w-full', className)}
    >
      {loading ? 'Loading...' : type}
    </button>
  );
};
