import { NavigationData } from '@/types/navigation-types';

export const homepageLinks: NavigationData = [
  {
    id: 1,
    url: '/leagues',
    linkText: 'Leagues',
    text: 'Want to see our leagues, and their statistics, and rankings? Here you can check everything about each league!',
    imageSrc: `/redrex.png`,
  },
  {
    id: 2,
    url: '/pets',
    linkText: 'Battle Pets',
    text: 'Looking for information about a specific pet? You can browse all the battle pets available in the game here!',
    imageSrc: `/greenrex.png`,
  },
  {
    id: 3,
    url: '/analyze-tool',
    linkText: 'Analyze Tool',
    text: 'Want to check your personal battle statistics? Check out the analyze tool and download the PDF of your battle result!',
    imageSrc: `/bluerex.png`,
  },
];
