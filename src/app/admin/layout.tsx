import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getUserSession,
  getAdminSession,
  getAuthorSession,
} from '@/features/supabase/actions/auth';
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
  const user = await getUserSession();
  const admin = await getAdminSession();
  const author = await getAuthorSession();

  if (!user && (!admin || !author)) {
    redirect('/');
  }

  const username = user?.user && user?.user?.username;
  const isAuthor = user?.user && user?.user?.role === 'author';
  const isAdmin = user?.user && user?.user?.role === 'admin';

  return (
    <div className='p-5'>
      <Container className='relative lg:flex lg:gap-5 px-0 lg:px-0'>
        <AdminSidebar
          isFwenLoggedIn={username === 'Fwen'}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
        />
        <div className='lg:flex-1'>
          <Heading>{`${username}'s Admin Panel`}</Heading>
          {children}
        </div>
      </Container>
    </div>
  );
}
