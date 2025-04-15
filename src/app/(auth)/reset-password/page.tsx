import { ResetPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Reset Password',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/reset-password`,
    },
  };
}

export default function ResetPasswordPage() {
  return (
    <Container className='max-w-[512px]'>
      <h1 className='text-center'>{'Reset Password'}</h1>
      <ResetPasswordForm />
    </Container>
  );
}
