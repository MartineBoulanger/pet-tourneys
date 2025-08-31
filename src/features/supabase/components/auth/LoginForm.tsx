'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/features/supabase/actions/auth';
import { Form, Input, LoginFormSkeleton, Paragraph } from '@/components/ui';
import { AuthButton } from './AuthButton';
import { LoginDiscord } from './LoginDiscord';

export const LoginForm = () => {
  const router = useRouter();
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
    const result = await signIn(formData);
    if (result.status === 'success') router.push('/');
    else setError(result.status);
    setLoading(false);
  };

  if (!isMounted) return <LoginFormSkeleton />;

  return (
    <>
      <div className='bg-light-grey shadow-md rounded-lg p-2.5 lg:p-5'>
        <Form handleSubmit={handleSubmit} message={error}>
          <Input label='Email' id='email' name='email' type='email' required />
          <Input
            label='Password'
            id='password'
            name='password'
            type='password'
            required
          />
          <AuthButton
            type='login'
            loading={loading}
            className='mt-2.5 lg:mt-5'
          />
        </Form>
        <div className='mt-2.5 lg:mt-5 flex items-center'>
          <Paragraph>{`Don't have an account?`}</Paragraph>
          <Link
            className='link font-bold ml-2.5'
            href='/register'
            title='sign up'
            aria-label='sign up'
          >
            {'Sign Up'}
          </Link>
        </div>
        <div className='mt-2.5 flex items-center'>
          <Paragraph>{`Forgot your password?`}</Paragraph>
          <Link
            className='link font-bold ml-2.5'
            href='/forgot-password'
            title='reset password'
            aria-label='reset password'
          >
            {'Reset Password'}
          </Link>
        </div>
      </div>
      <div className='mt-2.5 lg:mt-5 p-2.5 lg:p-5 bg-background rounded-lg shadow-md w-full flex justify-center'>
        <LoginDiscord />
      </div>
    </>
  );
};
