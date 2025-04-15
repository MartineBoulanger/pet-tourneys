import { Roboto } from 'next/font/google';
import local from 'next/font/local';

export const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

export const warcraft = local({
  variable: '--font-warcraft',
  src: './LifeCraft.ttf',
  display: 'swap',
});
