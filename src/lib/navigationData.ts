import { FaPatreon, FaDiscord, FaYoutube, FaShoppingBag } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import { NavigationData, FooterData } from './types';

export const headerData: NavigationData = [
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
    url: '/articles',
    linkText: 'Pet Battle Articles',
    text: 'Looking for a specific article about Pet Battle strategies? Checkout out all our articles on our articles page!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/greenrex.png`,
  },
  {
    id: 4,
    url: '/analyze-tool',
    linkText: 'Our Analysis Tool',
    text: 'Want to see the analysis of your personal pvp battle log? Check out our analysis tool and download the PDF of your battle logs analysis!',
    imageSrc: `${process.env.NEXT_PUBLIC_BASE_URL!}/images/bluegor.png`,
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
];

export const footerData: FooterData = [
  {
    id: 1,
    url: 'https://www.petbattlepvp.com/home',
    Icon: TbWorldWww,
    name: 'website',
  },
  {
    id: 2,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    Icon: FaDiscord,
    name: 'discord',
  },
  {
    id: 3,
    url: 'https://www.youtube.com/channel/UC99EpJ3nOedPOlGKXmlV25A',
    Icon: FaYoutube,
    name: 'youTube',
  },
  {
    id: 4,
    url: 'https://www.patreon.com/WarcraftPetBattleTournaments',
    Icon: FaPatreon,
    name: 'patreon',
  },
  {
    id: 5,
    url: 'https://petbattlepvp-shop.fourthwall.com/',
    Icon: FaShoppingBag,
    name: 'merch',
  },
];
