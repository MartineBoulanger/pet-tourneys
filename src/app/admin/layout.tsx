import { getUserSession } from '@/supabase/actions/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Heading } from '@/components/ui';
import { AdminPanelButtons } from '@/components/admin/AdminPanelButtons';

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
      <Heading>{`${username}'s Admin Panel`}</Heading>
      <AdminPanelButtons />
      {children}
    </div>
  );
}
