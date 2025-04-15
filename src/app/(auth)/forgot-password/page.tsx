import { ForgotPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Forgot Password',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/forgot-password`,
    },
  };
}

export default function ForgotPasswordPage() {
  return (
    <Container className='w-full max-w-[512px]'>
      <h1 className='text-center'>{'Forgot Password'}</h1>
      <ForgotPasswordForm />
    </Container>
  );
}
