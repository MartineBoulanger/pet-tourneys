import { PartnersData } from '@/lib/types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

export const partnersData: PartnersData = [
  {
    name: 'Icy Veins',
    image: `${baseUrl}/images/partners/icyveins-shirt.png`,
  },
  {
    name: 'WarcraftPets.com',
    image: `${baseUrl}/images/partners/warcraftpets-shirt.png`,
  },
  {
    name: 'Starship',
    image: `${baseUrl}/images/partners/starship-shirt.png`,
  },
  {
    name: 'Paws Your Game',
    image: `${baseUrl}/images/partners/paws-shirt.png`,
  },
  { name: 'Valor', image: `${baseUrl}/images/partners/valor-shirt.png` },
  {
    name: 'WoW-PetGuide.com',
    image: `${baseUrl}/images/partners/xufu-shirt.png`,
  },
  {
    name: 'Raider.io',
    image: `${baseUrl}/images/partners/raiderio-shirt.png`,
  },
];
