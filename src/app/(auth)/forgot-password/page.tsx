import { ForgotPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export default function ForgotPasswordPage() {
  return (
    <Container className='w-full max-w-[512px]'>
      <h1 className='text-center'>{'Forgot Password'}</h1>
      <ForgotPasswordForm />
    </Container>
  );
}
