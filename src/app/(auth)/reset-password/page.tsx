import { ResetPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export default function ResetPasswordPage() {
  return (
    <Container className='max-w-[512px]'>
      <h1 className='text-center'>{'Reset Password'}</h1>
      <ResetPasswordForm />
    </Container>
  );
}
