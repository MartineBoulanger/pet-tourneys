import { redirect } from 'next/navigation';
import { Container, Heading, Paragraph } from '@/components/ui';
import { Login } from '@/components/auth/Login';
import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';

export async function generateMetadata() {
  return {
    title: 'Login',
    alternates: {
      canonical: `${process.env.BASE_URL!}/login`,
    },
    description: 'Pet Masters League - Login to your account.',
  };
}

export default async function LoginPage() {
  const user = await getUserSession();
  if (user?.status === 'success' && user?.user) redirect('/');

  return (
    <Container className='max-w-[512px]'>
      <Heading className='text-center'>{'Sign in'}</Heading>
      <Paragraph className='text-center mb-5'>
        {
          'Only admins, and authors can see the admin panel. So, if you are a PML author, or a staff member who needs admin access, please let us know on Discord, we will grant you the correct access.'
        }
      </Paragraph>
      <div className='mt-2.5 lg:mt-5 p-2.5 lg:p-5 bg-background rounded-lg shadow-md w-full flex justify-center'>
        <Login />
      </div>
    </Container>
  );
}
