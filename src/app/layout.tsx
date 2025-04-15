import type { Metadata, Viewport } from 'next';
import { roboto, warcraft } from '@/styles/fonts';
import '@/styles/globals.css';
import { getAdminSession, getUserSession } from '@/supabase/actions/auth';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { BottomNavigation } from '@/components/header/BottomNavigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    template: '%s | Pet Tourneys',
    default: 'Pet Tourneys',
  },
  description:
    'The WoW Pet Community for all things pet battling and battle pets related',
  robots: { index: true, follow: true },
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
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
