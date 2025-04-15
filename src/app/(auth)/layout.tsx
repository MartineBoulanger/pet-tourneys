import { getUserSession } from '@/supabase/actions/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await getUserSession();
  if (response?.user) {
    redirect('/');
  }
  return <>{children}</>;
}
