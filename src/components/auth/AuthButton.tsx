import React from 'react';
import { cn } from '@/utils/cn';
import { AuthButtonProps } from '@/types';
import { Button } from '@/components/ui';

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
