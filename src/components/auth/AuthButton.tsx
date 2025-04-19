import React from 'react';
import { cn } from '@/utils/cn';
import { AuthButtonProps } from '@/types';

export const AuthButton = ({ type, loading, className }: AuthButtonProps) => {
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
