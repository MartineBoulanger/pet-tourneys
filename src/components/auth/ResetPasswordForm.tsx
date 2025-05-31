'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPassword } from '@/supabase/actions/auth';
import { AuthButton } from '@/components/auth/AuthButton';
import { Form, Input, ForgotResetFormSkeleton } from '@/components/ui';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData(event.currentTarget);
    const result = await resetPassword(
      formData,
      searchParams.get('code') as string
    );
    if (result.status === 'success') {
      router.push('/');
    } else {
      setError(result.status);
    }
    setLoading(false);
  };

  if (!isMounted) return <ForgotResetFormSkeleton />;

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-2.5 sm:p-5'>
      <Form handleSubmit={handleSubmit} message={error}>
        <Input
          type='password'
          label='Password'
          id='password'
          name='password'
          required
        />
        <AuthButton
          type='Reset Password'
          loading={loading}
          className='mt-2.5 sm:mt-5'
        />
      </Form>
    </div>
  );
};
