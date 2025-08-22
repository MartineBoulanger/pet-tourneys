import { LoginForm } from '@/components/auth/LoginForm';
import { Container, Heading, Paragraph } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Login',
    alternates: {
      canonical: `${process.env.BASE_URL!}/login`,
    },
  };
}

export default function LoginPage() {
  return (
    <Container className='max-w-[512px]'>
      <Heading className='text-center'>{'Sign in'}</Heading>
      <Paragraph className='text-center mb-5'>
        {'Logins are only for admin users.'}
      </Paragraph>
      <LoginForm />
    </Container>
  );
}
