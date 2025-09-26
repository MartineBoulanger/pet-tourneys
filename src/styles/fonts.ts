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

export const brutals = local({
  variable: '--font-brutals',
  src: './BRUTALS.ttf',
  display: 'swap',
});

export const brutalsTilted = local({
  variable: '--font-brutals-tilted',
  src: './BRUTALS Tilted.ttf',
  display: 'swap',
});
