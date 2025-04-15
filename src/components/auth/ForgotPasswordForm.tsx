'use client';

import { useState, useEffect } from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { Form, Input, ForgotResetFormSkeleton } from '@/components/ui';
import { forgotPassword } from '@/supabase/actions/auth';

export const ForgotPasswordForm = () => {
  const [error, setError] = useState<string>('');
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
    const result = await forgotPassword(formData);
    if (result.status === 'success') {
      alert('Password reset link sent to your email');
    } else {
      setError(result.status);
    }
    setLoading(false);
  };

  if (!isMounted) return <ForgotResetFormSkeleton />;

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-5'>
      <Form handleSubmit={handleSubmit} message={error}>
        <Input type='email' label='Email' id='email' name='email' required />
        <AuthButton type='Forgot Password' loading={loading} className='mt-4' />
      </Form>
    </div>
  );
};
