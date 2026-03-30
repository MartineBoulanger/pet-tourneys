import {
  FaDiscord,
  FaYoutube,
  FaTwitch,
  FaInstagram,
  FaTiktok,
} from 'react-icons/fa';
import { FaBluesky } from 'react-icons/fa6';
import { FooterData } from '@/types/navigation-types';

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
