import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Container, Heading } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Reset Password',
    alternates: {
      canonical: `${process.env.BASE_URL!}/reset-password`,
    },
  };
}

export default function ResetPasswordPage() {
  return (
    <Container className='max-w-[512px]'>
      <Heading className='text-center'>{'Reset Password'}</Heading>
      <ResetPasswordForm />
    </Container>
  );
}
