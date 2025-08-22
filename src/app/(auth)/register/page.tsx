import { SignUpForm } from '@/components/auth';
import { Container, Heading, Paragraph } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Sign Up',
    alternates: {
      canonical: `${process.env.BASE_URL!}/register`,
    },
  };
}

export default function SignUpPage() {
  return (
    <Container className='max-w-[512px]'>
      <Heading className='text-center'>{'Sign Up'}</Heading>
      <Paragraph className='text-center mb-5'>
        {'Email and password sign up is only for the community staff.'}
      </Paragraph>
      <SignUpForm />
    </Container>
  );
}
