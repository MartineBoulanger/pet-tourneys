import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/features/supabase/actions/auth';
import { AdminSidebar } from '@/features/supabase/components/admin/AdminSidebar';
import { Container, Heading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Admin Panel',
  robots: { index: false, follow: false },
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await getUserSession();

  if (!response?.user || response?.user?.role !== 'admin') {
    redirect('/');
  }

  const username = response?.user && response?.user?.username;

  return (
    <div className='p-5'>
      <Container className='relative lg:flex lg:gap-5 px-0 lg:px-0'>
        <AdminSidebar isFwenLoggedIn={username === 'Fwen'} />
        <div className='lg:flex-1'>
          <Heading>{`${username}'s Admin Panel`}</Heading>
          {children}
        </div>
      </Container>
    </div>
  );
}
