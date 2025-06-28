import { ForgotPasswordForm } from '@/components/auth';
import { Container, Heading } from '@/components/ui';

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
    <Container className='max-w-[512px]'>
      <Heading className='text-center'>{'Forgot Password'}</Heading>
      <ForgotPasswordForm />
    </Container>
  );
}
