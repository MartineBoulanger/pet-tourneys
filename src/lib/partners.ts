import { PartnersData } from './types';

const baseUrl = process.env.BASE_URL!;

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
    isPriority: true,
  },
  {
    name: 'Paws Your Game',
    image: `${baseUrl}/images/partners/paws-shirt.png`,
    isPriority: true,
  },
  {
    name: 'Valor',
    image: `${baseUrl}/images/partners/valor-shirt.png`,
    isPriority: true,
  },
  {
    name: 'WoW-PetGuide.com',
    image: `${baseUrl}/images/partners/xufu-shirt.png`,
  },
  {
    name: 'Raider.io',
    image: `${baseUrl}/images/partners/raiderio-shirt.png`,
  },
];
