import {
  FaPatreon,
  FaDiscord,
  FaYoutube,
  FaShoppingBag,
  FaPaypal,
  FaTwitch,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';
import { FaBluesky } from 'react-icons/fa6';
import { GrResources } from 'react-icons/gr';
import { NavigationData, FooterData } from './types';

export const headerData: NavigationData = [
  {
    id: 1,
    url: '/',
    linkText: 'Home',
    text: '',
    imageSrc: `/images/PML_Logo.png`,
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
      {
        id: 3,
        url: '/tournaments/hall-of-fame',
        text: 'Hall of Fame',
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

export const homepageLinks: NavigationData = [
  {
    id: 1,
    url: '/tournaments',
    linkText: 'Leagues',
    text: 'Want to see our leagues, and their statistics, and rankings? Here you can check everything about each league!',
    imageSrc: `/images/redrex.png`,
  },
  {
    id: 2,
    url: '/analyze-tool',
    linkText: 'Analyze Tool',
    text: 'Want to check your personal battle statistics? Check out the analyze tool and download the PDF of your battle result!',
    imageSrc: `/images/greengor.png`,
  },
  {
    id: 3,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    linkText: 'Join Discord',
    text: 'Want to talk to other pet battlers? Or are you interested in joining a league? Join our Discord to find out more about us!',
    imageSrc: `/images/bluerex.png`,
  },
];

export const adminData: NavigationData = [
  {
    id: 1,
    url: '/admin/images',
    linkText: 'Manage All Images',
    text: 'Manage all the images of recent and previous tournaments.',
    imageSrc: `/images/bluegor.png`,
    roleAllowed: 'both',
  },
];

export const leaguesAdminData: NavigationData = [
  {
    id: 1,
    url: '/admin/tournaments',
    linkText: 'Manage Leagues',
    text: 'Manage all leagues.',
    imageSrc: '/images/greengor.png',
    roleAllowed: 'admin',
  },
  {
    id: 2,
    url: '/admin/rules',
    linkText: 'Manage League Rules',
    text: 'Manage the rules of the league.',
    imageSrc: '/images/greenrex.png',
    roleAllowed: 'admin',
  },
  {
    id: 3,
    url: '/admin/prizes',
    linkText: 'Manage League Prizes',
    text: 'Manage the prizes of the league.',
    imageSrc: '/images/redrex.png',
    roleAllowed: 'admin',
  },
];

export const contentManagementData: NavigationData = [
  {
    id: 1,
    url: '/admin/homepage',
    linkText: 'Manage Homepage Sections',
    text: 'Manage the sections for schedule, signups and announcements for the new league season.',
    imageSrc: '/images/bluegor.png',
    roleAllowed: 'admin',
  },
  {
    id: 2,
    url: '/admin/resources',
    linkText: 'Manage All Resources',
    text: 'Manage all the resource sections for the resources page.',
    imageSrc: '/images/bluerex.png',
    roleAllowed: 'admin',
  },
  {
    id: 3,
    url: '/admin/pages',
    linkText: 'Manage Pages',
    text: 'Manage the article, guide and pet review pages.',
    imageSrc: '/images/bluerex.png',
    roleAllowed: 'both',
  },
];

export const footerData: FooterData = [
  {
    id: 1,
    url: 'https://petbattlepvp-shop.fourthwall.com/',
    Icon: FaShoppingBag,
    name: 'Merchandise',
  },
  {
    id: 2,
    url: 'https://www.patreon.com/WarcraftPetBattleTournaments',
    Icon: FaPatreon,
    name: 'Support Us',
  },
  {
    id: 3,
    url: 'https://www.paypal.com/donate/?hosted_button_id=9DXG8Z3SRSE2A',
    Icon: FaPaypal,
    name: 'Prize Support',
  },
  {
    id: 4,
    url: '/resources',
    Icon: GrResources,
    name: 'Resources',
  },
];

export const socialsData: FooterData = [
  {
    id: 1,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    Icon: FaDiscord,
    name: 'Discord',
  },
  {
    id: 2,
    url: 'https://www.youtube.com/@PetMastersLeague',
    Icon: FaYoutube,
    name: 'YouTube',
  },
  {
    id: 3,
    url: 'https://www.twitch.tv/petmastersleague',
    Icon: FaTwitch,
    name: 'Twitch',
  },
  {
    id: 4,
    url: 'https://www.instagram.com/petmastersleague/',
    Icon: FaInstagram,
    name: 'Instagram',
  },
  {
    id: 5,
    url: 'https://www.tiktok.com/@petmastersleague',
    Icon: FaTiktok,
    name: 'TikTok',
  },
  {
    id: 6,
    url: 'https://bsky.app/profile/petmastersleague.bsky.social',
    Icon: FaBluesky,
    name: 'Bluesky',
  },
];
