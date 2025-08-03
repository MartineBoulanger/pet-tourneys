import {
  FaPatreon,
  FaDiscord,
  FaYoutube,
  FaShoppingBag,
  FaPaypal,
} from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import { NavigationData, FooterData } from './types';

export const headerData: NavigationData = [
  {
    id: 1,
    url: '/tournaments',
    linkText: 'Tournaments',
    text: 'These are the tournaments we are living for! Here you can check all the matches and statistics of each tournament!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/redrex.png`,
    children: [
      {
        id: 1,
        url: '/tournaments/rules',
        text: 'Rules',
      },
      {
        id: 2,
        url: '/tournaments/prizes',
        text: 'Prizes',
      },
      {
        id: 3,
        url: '/tournaments/stages',
        text: 'Stages',
      },
      {
        id: 4,
        url: '/tournaments/schedule',
        text: 'Schedule',
      },
      {
        id: 5,
        url: '/tournaments/sign-ups',
        text: 'Sign-ups',
      },
    ],
  },
  {
    id: 2,
    url: '/guides',
    linkText: 'Guides',
    text: 'Looking for a specific guide for Pet Battling or for the Tourney system? Checkout out all the guides on the guides page!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/bluerex.png`,
  },
  {
    id: 3,
    url: '/articles',
    linkText: 'Articles',
    text: 'Looking for a specific article about Pet Battle strategies? Checkout out all the articles on the articles page!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greenrex.png`,
  },
  {
    id: 4,
    url: '/pet-reviews',
    linkText: 'Pet Reviews',
    text: 'Looking for a pet that is great for PvP? Checkout out all the pet reviews to see which pet you can best use for PvP!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/bluegor.png`,
  },
  {
    id: 5,
    url: '/analyze-tool',
    linkText: 'Analyze Tool',
    text: 'Want to check your personal battle statistics? Check out the analyze tool and download the PDF of your battle result!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greengor.png`,
  },
];

export const adminData: NavigationData = [
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
  {
    id: 3,
    url: '/admin/upload-pets',
    linkText: 'Upload Pets Data',
    text: 'Upload the data from all pets in the game to create a JSOn file to use as data file.',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/redrex.png`,
  },
  {
    id: 4,
    url: '/admin/rules',
    linkText: 'Manage Tournament Rules',
    text: 'Manage the rules of the tournaments.',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greenrex.png`,
  },
];

export const footerData: FooterData = [
  {
    id: 1,
    url: 'https://www.petbattlepvp.com/home',
    Icon: TbWorldWww,
    name: 'Website',
  },
  {
    id: 2,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    Icon: FaDiscord,
    name: 'Discord',
  },
  {
    id: 3,
    url: 'https://www.youtube.com/channel/UC99EpJ3nOedPOlGKXmlV25A',
    Icon: FaYoutube,
    name: 'YouTube',
  },
  {
    id: 4,
    url: 'https://petbattlepvp-shop.fourthwall.com/',
    Icon: FaShoppingBag,
    name: 'Merchandise',
  },
  {
    id: 5,
    url: 'https://www.patreon.com/WarcraftPetBattleTournaments',
    Icon: FaPatreon,
    name: 'Support Us',
  },
  {
    id: 6,
    url: 'https://www.google.com/url?q=https%3A%2F%2Fwww.paypal.com%2Fncp%2Fpayment%2F9PRLQWUF22E3Q&sa=D&sntz=1&usg=AOvVaw1IhWJF7DQUhPGjUpTmJwVY',
    Icon: FaPaypal,
    name: 'Prize Support',
  },
];
