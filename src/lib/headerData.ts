import { NavigationData } from '@/types';

export const headerData: NavigationData[] = [
  {
    id: 1,
    url: '/tournaments',
    linkText: 'Tournaments List',
    text: 'Check out the tournament match results!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/redrex.png`,
  },
];
