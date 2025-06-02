import {
  PetData,
  PET_SOURCES,
  PROFESSIONS,
  EXPANSIONS,
  LOCATIONS,
} from './types';

export const aquatic_pets: PetData[] = [
  {
    name: 'Wood Frog',
    speciesID: 64,
    type: 'Aquatic',
    isTradable: true,
    source: 'Vendor',
    eventName: 'Darkmoon Faire',
    flavor:
      'Vendors at the Darkmoon Faire offer strange and exotic wonders. They also sell wood frogs.',
    icon: 'pet-icons/hex.png',
    possibleBreeds: ['H/S'],
    baseStats: [8.5, 7.5, 8],
    image: 'pets/wood_frog.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Water Jet',
          lvl10: 'Tongue Lash',
        },
        slot2: {
          lvl2: 'Healing Wave',
          lvl15: 'Cleansing Rain',
        },
        slot3: {
          lvl4: 'Frog Kiss',
          lvl20: 'Swarm of Flies',
        },
      },
    ],
  },
  {
    name: 'Tree Frog',
    speciesID: 65,
    type: 'Aquatic',
    isTradable: true,
    source: 'Vendor',
    eventName: 'Darkmoon Faire',
    flavor: 'Known for their powerful legs and keen eyesight.',
    icon: 'pet-icons/hex.png',
    possibleBreeds: ['H/B'],
    baseStats: [8.5, 7.5, 8],
    image: 'pets/tree_frog.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Water Jet',
          lvl10: 'Tongue Lash',
        },
        slot2: {
          lvl2: 'Healing Wave',
          lvl15: 'Cleansing Rain',
        },
        slot3: {
          lvl4: 'Frog Kiss',
          lvl20: 'Swarm of Flies',
        },
      },
    ],
  },
  {
    name: 'Jubling',
    speciesID: 106,
    type: 'Aquatic',
    isTradable: true,
    source: 'World Event',
    eventName: 'Darkmoon Faire',
    flavor:
      'The legendary ale frog was believed to be extinct until the strange brews at the Darkmoon Faire brought them out of hiding.',
    icon: 'pet-icons/hex.png',
    possibleBreeds: ['P/B'],
    baseStats: [8.5, 7.5, 8],
    image: 'pets/jubling.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Water Jet',
          lvl10: 'Tongue Lash',
        },
        slot2: {
          lvl2: 'Healing Wave',
          lvl15: 'Cleansing Rain',
        },
        slot3: {
          lvl4: 'Frog Kiss',
          lvl20: 'Swarm of Flies',
        },
      },
    ],
  },
  {
    name: 'Land Shark',
    speciesID: 115,
    type: 'Aquatic',
    isTradable: true,
    source: 'Fishing',
    eventName: '',
    flavor:
      'After birth, newborn sharks quickly flee their hungry mothers. Their early independence makes them dangerous, even while young.',
    icon: 'pet-icons/babyshark.png',
    possibleBreeds: ['B/B'],
    baseStats: [8, 8, 8],
    image: 'pets/land_shark.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Water Jet',
          lvl10: 'Tail Slap',
        },
        slot2: {
          lvl2: 'Tidal Wave',
          lvl15: 'Focus',
        },
        slot3: {
          lvl4: 'Blood in the Water',
          lvl20: 'Swallow You Whole',
        },
      },
    ],
  },
];
