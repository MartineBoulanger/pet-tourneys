import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/features/supabase/actions/auth';
import { AdminPanelButtons } from '@/features/supabase/components/admin/AdminPanelButtons';
import { Heading } from '@/components/ui';

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
