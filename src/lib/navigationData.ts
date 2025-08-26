import {
  FaPatreon,
  FaDiscord,
  FaYoutube,
  FaShoppingBag,
  FaPaypal,
} from 'react-icons/fa';
import { GrResources } from 'react-icons/gr';
import { NavigationData, FooterData } from './types';

export const headerData: NavigationData = [
  {
    id: 1,
    url: '/',
    linkText: 'Home',
    text: '',
    imageSrc: `/images/PML_Logo.jpg`,
  },
  {
    id: 2,
    url: '/tournaments',
    linkText: 'Leagues',
    text: 'These are the leagues we are living for! Here you can check all the matches and statistics of each league!',
    imageSrc: `/images/redrex.png`,
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
    ],
  },
  {
    id: 3,
    url: '/guides',
    linkText: 'Guides',
    text: 'Looking for a specific guide for Pet Battling or for the league system? Checkout out all the guides on the guides page!',
    imageSrc: `/images/bluerex.png`,
  },
  {
    id: 4,
    url: '/articles',
    linkText: 'Articles',
    text: 'Looking for a specific article about Pet Battle strategies? Checkout out all the articles on the articles page!',
    imageSrc: `/images/greenrex.png`,
  },
  {
    id: 5,
    url: '/pet-reviews',
    linkText: 'Pet Reviews',
    text: 'Looking for a pet that is great for PvP? Checkout out all the pet reviews to see which pet you can best use for PvP!',
    imageSrc: `/images/bluegor.png`,
  },
  {
    id: 6,
    url: '/analyze-tool',
    linkText: 'Analyze Tool',
    text: 'Want to check your personal battle statistics? Check out the analyze tool and download the PDF of your battle result!',
    imageSrc: `/images/greengor.png`,
  },
];

export const adminData: NavigationData = [
  {
    id: 1,
    url: '/admin/upload-pets',
    linkText: 'Upload Pets Data',
    text: 'Upload the data from all pets in the game to create a JSON file to use as data file.',
    imageSrc: `/images/redrex.png`,
  },
  {
    id: 2,
    url: '/admin/image-manager',
    linkText: 'Manage All Images',
    text: 'Manage all the images of recent and previous tournaments.',
    imageSrc: `/images/bluegor.png`,
  },
  {
    id: 3,
    url: '/admin/resources',
    linkText: 'Manage All Resources',
    text: 'Manage all the resource sections for the resources page.',
    imageSrc: `/images/bluerex.png`,
  },
  {
    id: 4,
    url: '/admin/tournaments',
    linkText: 'Manage Leagues',
    text: 'Manage all leagues.',
    imageSrc: `/images/greengor.png`,
  },
  {
    id: 5,
    url: '/admin/rules',
    linkText: 'Manage League Rules',
    text: 'Manage the rules of the league.',
    imageSrc: `/images/greenrex.png`,
  },
  {
    id: 6,
    url: '/admin/prizes',
    linkText: 'Manage League Prizes',
    text: 'Manage the prizes of the league.',
    imageSrc: `/images/redrex.png`,
  },
  {
    id: 7,
    url: '/admin/homepage',
    linkText: 'Manage Homepage Sections',
    text: 'Manage the sections for schedule, signups and announcements for the new league season.',
    imageSrc: `/images/bluegor.png`,
  },
];

export const footerData: FooterData = [
  {
    id: 1,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    Icon: FaDiscord,
    name: 'Discord',
  },
  {
    id: 2,
    url: 'https://www.youtube.com/channel/UC99EpJ3nOedPOlGKXmlV25A',
    Icon: FaYoutube,
    name: 'YouTube',
  },
  {
    id: 3,
    url: 'https://petbattlepvp-shop.fourthwall.com/',
    Icon: FaShoppingBag,
    name: 'Merchandise',
  },
  {
    id: 4,
    url: 'https://www.patreon.com/WarcraftPetBattleTournaments',
    Icon: FaPatreon,
    name: 'Support Us',
  },
  {
    id: 5,
    url: 'https://www.google.com/url?q=https%3A%2F%2Fwww.paypal.com%2Fncp%2Fpayment%2F9PRLQWUF22E3Q&sa=D&sntz=1&usg=AOvVaw1IhWJF7DQUhPGjUpTmJwVY',
    Icon: FaPaypal,
    name: 'Prize Support',
  },
  {
    id: 6,
    url: '/resources',
    Icon: GrResources,
    name: 'Resources',
  },
];
