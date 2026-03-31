import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/actions/supabase/api-schema/auth/getUserSession';
import { AdminSidebar } from '@/components/admin-panel/AdminSidebar';
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
  if (!user?.user) redirect('/');

  const username = user?.user?.username;
  const admin = user?.user?.role === 'admin';
  const author = user?.user?.role === 'author';

  if (!admin && !author) redirect('/');

  return (
    <div className='p-5'>
      <Container className='relative lg:flex lg:gap-5 px-0 lg:px-0'>
        <AdminSidebar isAuthor={author} isAdmin={admin} />
        <div className='lg:flex-1'>
          <Heading className='mb-5'>{`${username}'s Admin Panel`}</Heading>
          {children}
        </div>
      </Container>
    </div>
  );
}

// TODO: Add error handling and loading states, and consider using a more robust authentication method for server components.
// TODO: sitemap links for the pet detail page needs to be done
// TODO: Create a Radio component for the forms
