'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/supabase/actions/auth';
import { AuthButton } from '@/components/auth/AuthButton';
import { Form, Input, SignUpFormSkeleton } from '@/components/ui';

export const SignUpForm = () => {
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
    const result = await signUp(formData);
    if (result.status === 'success') router.push('/login');
    else setError(`${result.status} - ${result.message}`);
    setLoading(false);
  };

  if (!isMounted) return <SignUpFormSkeleton />;

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-5'>
      <Form handleSubmit={handleSubmit} message={error}>
        <Input
          type='text'
          label='Username'
          id='username'
          name='username'
          required
        />
        <Input type='email' label='Email' id='Email' name='email' required />
        <Input
          type='password'
          label='Password'
          name='password'
          id='password'
          required
        />
        <AuthButton type='Sign up' loading={loading} className='mt-4' />
      </Form>
      <div className='mt-4 flex items-center'>
        <p>{'Already have an account?'}</p>
        <Link className='link font-bold ml-2' href='/login'>
          {'Sign In'}
        </Link>
      </div>
    </div>
  );
};
