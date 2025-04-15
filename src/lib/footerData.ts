import { FaPatreon, FaDiscord, FaYoutube } from 'react-icons/fa';
import { TbWorldWww } from 'react-icons/tb';
import { FooterData } from '@/types';

export const footerData: FooterData[] = [
  {
    id: 1,
    url: 'https://www.petbattlepvp.com/home',
    Icon: TbWorldWww,
    name: 'website',
  },
  {
    id: 2,
    url: 'https://www.patreon.com/WarcraftPetBattleTournaments',
    Icon: FaPatreon,
    name: 'patreon',
  },
  {
    id: 3,
    url: 'http://www.google.com/url?q=http%3A%2F%2Fdiscord.gg%2Fg6Y2D7Gtew&sa=D&sntz=1&usg=AOvVaw2O2u0NiXvNkTvCDX8p5LNJ',
    Icon: FaDiscord,
    name: 'discord',
  },
  {
    id: 4,
    url: 'https://www.youtube.com/channel/UC99EpJ3nOedPOlGKXmlV25A',
    Icon: FaYoutube,
    name: 'youTube',
  },
];
