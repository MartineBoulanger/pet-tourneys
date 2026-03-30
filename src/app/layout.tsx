import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { FaCheck, FaInfo } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import { BiErrorAlt } from 'react-icons/bi';
import { roboto, brutals, brutalsTilted } from '@/styles/fonts';
import '@/styles/globals.css';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { CookieBannerWrapper } from '@/components/cookie-banner/CookieBannerWrapper';

export const metadata: Metadata = {
  title: {
    template: '%s | PML',
    default: 'Pet Masters League',
  },
  description: 'Pet Masters League - your pets, your mission, your victory!',
  robots: { index: true, follow: true },
  keywords: [
    'WoW, PML, pet, pets, pet battle, PvP, battle pet, pet masters league, pet pvp',
  ],
  metadataBase: new URL(process.env.BASE_URL!),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${roboto.variable} $${brutals.variable} ${brutalsTilted.variable} antialiased font-sans`}
      >
        <Header />
        <main className='min-h-[85vh] relative'>{children}</main>
        <Footer />
        <BottomNavigation />
        <Toaster
          expand={true}
          position='bottom-right'
          icons={{
            success: <FaCheck />,
            info: <FaInfo />,
            warning: <IoWarningOutline />,
            error: <BiErrorAlt />,
          }}
        />
        <CookieBannerWrapper />
      </body>
    </html>
  );
}
