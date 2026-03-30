import { FaShoppingBag, FaPatreon, FaPaypal } from 'react-icons/fa';
import { GrResources } from 'react-icons/gr';
import { FooterData } from '@/types/navigation-types';

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
