import { NavigationData } from '@/types/navigation-types';

export const headerData: NavigationData = [
  {
    id: 1,
    url: '/',
    linkText: 'Home',
    text: '',
  },
  {
    id: 2,
    url: '/leagues',
    linkText: 'Leagues',
    text: 'These are the leagues we are living for! Here you can check all the matches and statistics of each league!',
    children: [
      {
        id: 1,
        url: '/leagues/rules',
        text: 'Rules',
      },
      {
        id: 2,
        url: '/leagues/prizes',
        text: 'Prizes',
      },
      {
        id: 3,
        url: '/leagues/hall-of-fame',
        text: 'Hall of Fame',
      },
    ],
  },
  {
    id: 3,
    url: '/pets',
    linkText: 'Battle Pets',
    text: 'Looking for a specific battle pet or just want to check them out? Checkout out all battle pets on our pets page!',
  },
  {
    id: 4,
    url: '/guides',
    linkText: 'Guides',
    text: 'Looking for a specific guide for Pet Battling or for the league system? Checkout out all the guides on the guides page!',
  },
  {
    id: 5,
    url: '/articles',
    linkText: 'Articles',
    text: 'Looking for a specific article about Pet Battle strategies? Checkout out all the articles on the articles page!',
  },
  {
    id: 6,
    url: '/pet-reviews',
    linkText: 'Pet Reviews',
    text: 'Looking for a pet that is great for PvP? Checkout out all the pet reviews to see which pet you can best use for PvP!',
  },
  {
    id: 7,
    url: '/analyze-tool',
    linkText: 'Analyze Tool',
    text: 'Want to check your personal battle statistics? Check out the analyze tool and download the PDF of your battle result!',
  },
];
