import type { Metadata, Viewport } from 'next';
import { roboto, warcraft } from '@/styles/fonts';
import '@/styles/globals.css';
import { getAdminSession, getUserSession } from '@/supabase/actions/auth';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { BottomNavigation } from '@/components/header/BottomNavigation';

export const metadata: Metadata = {
  title: 'WoW Pet Community',
  description:
    'WoW Pet Community for all things pet battling and battle pets related',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#202020',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSession();
  const admin = await getAdminSession();
  const isAdmin =
    user?.user?.id === admin?.admin.id ? admin?.admin : user?.user;

  return (
    <html lang='en'>
      <body
        className={`${roboto.variable} ${warcraft.variable} antialiased font-sans`}
      >
        <Header />
        <main className='min-h-screen relative'>{children}</main>
        <Footer />
        <BottomNavigation user={isAdmin} />
      </body>
    </html>
  );
}
