import { NavigationData } from '@/types';

export const adminData: NavigationData[] = [
  {
    id: 1,
    url: '/admin/tournaments/new',
    linkText: 'Create A Tournament',
    text: 'Create a new tournament',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greengor.png`,
  },
  {
    id: 2,
    url: '/admin/upload-logs',
    linkText: 'Upload Battle Logs',
    text: 'Upload the battle logs from the match',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/bluegor.png`,
  },
];
