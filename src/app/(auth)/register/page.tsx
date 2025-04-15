import { SignUpForm } from '@/components/auth';
import { Container } from '@/components/ui';

export default function SignUpPage() {
  return (
    <Container className='max-w-[512px]'>
      <h1 className='text-center'>{'Sign Up'}</h1>
      <p className='text-center mb-5'>
        {'Email and password sign up is only for the community staff.'}
      </p>
      <SignUpForm />
    </Container>
  );
}
