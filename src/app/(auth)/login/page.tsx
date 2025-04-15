import { LoginForm } from '@/components/auth';
import { Container } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Login',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL!}/login`,
    },
  };
}

export default function LoginPage() {
  return (
    <Container className='max-w-[512px]'>
      <h1 className='text-center'>{'Sign in'}</h1>
      <p className='text-center mb-5'>{'Logins are only for admin users.'}</p>
      <LoginForm />
    </Container>
  );
}
