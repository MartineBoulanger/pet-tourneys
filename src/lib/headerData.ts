import { NavigationData } from '@/types';

export const headerData: NavigationData[] = [
  {
    id: 1,
    url: '/tournaments',
    linkText: 'Tournaments List',
    text: 'Check out the tournament match results!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/redrex.png`,
  },
  {
    id: 2,
    url: '/guides',
    linkText: 'Our Guides',
    text: 'Looking for a specific guide for Pet Battling or for the Tourney system? Checkout out all our guides on our guides page!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/bluerex.png`,
  },
  {
    id: 3,
    url: '/analyze-tool',
    linkText: 'Our Analysis Tool',
    text: 'Want to see the analysis of your personal pvp battle log? Check out our analysis tool and download the PDF of your battle logs analysis!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greenrex.png`,
  },
];
