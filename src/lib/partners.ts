import { PartnersData } from './types';

const baseUrl = process.env.BASE_URL!;

export const partnersData: PartnersData = [
  {
    name: 'Icy Veins',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700587/pml-images/icyveins-shirt.png',
  },
  {
    name: 'WarcraftPets.com',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700585/pml-images/warcraftpets-shirt.png',
  },
  {
    name: 'Starship',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700586/pml-images/starship-shirt.png',
    isPriority: true,
  },
  {
    name: 'Paws Your Game',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700605/pml-images/paws-shirt.png',
    isPriority: true,
  },
  {
    name: 'Valor',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700606/pml-images/valor-shirt.png',
    isPriority: true,
  },
  {
    name: 'WoW-PetGuide.com',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700606/pml-images/xufu-shirt.png',
  },
  {
    name: 'Raider.io',
    image:
      'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700586/pml-images/raiderio-shirt.png',
  },
];
