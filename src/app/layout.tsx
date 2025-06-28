import type { Metadata, Viewport } from 'next';
import { roboto, warcraft } from '@/styles/fonts';
import '@/styles/globals.css';
import { getAdminSession, getUserSession } from '@/supabase/actions/auth';
import { Footer } from '@/components/footer/Footer';
import { Header } from '@/components/header/Header';
import { BottomNavigation } from '@/components/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import { FaCheck, FaInfo } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import { BiErrorAlt } from 'react-icons/bi';
import { ScrollToTop } from '@/components/ui';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    template: '%s | Pet Tourneys',
    default: 'Pet Tourneys',
  },
  description:
    'The WoW Pet Community for all things pet battling and battle pets related',
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    images: '/opengraph-image.png',
  },
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
        <main className='min-h-[85vh] relative'>{children}</main>
        <Footer />
        <BottomNavigation user={isAdmin} />
        <ScrollToTop />
        <Toaster
          expand
          position='top-center'
          icons={{
            success: <FaCheck />,
            info: <FaInfo />,
            warning: <IoWarningOutline />,
            error: <BiErrorAlt />,
          }}
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
