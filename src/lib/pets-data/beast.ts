import {
  PetData,
  PET_SOURCES,
  PROFESSIONS,
  EXPANSIONS,
  LOCATIONS,
} from './types';

export const beast_pets: PetData[] = [
  {
    name: 'Bombay Cat',
    speciesID: 40,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      'Donni Anthania plans to have a bombay buried with her when she dies. A wise adventurer can put its talents to much better use.',
    icon: 'pet-icons/bombaycat.png',
    possibleBreeds: [6],
    baseStats: [7, 8.5, 8.5],
    image: 'pets/bombay_cat.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'Cornish Rex Cat',
    speciesID: 41,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      "Donni Anthania invites these cats to her tea parties. But she doesn't serve their favorite drink: the tears of their enemies.",
    icon: 'pet-icons/cornishrexcat.png',
    possibleBreeds: [2],
    baseStats: [7, 8.5, 8.5],
    image: 'pets/cornish_rex.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'Black Tabby Cat',
    speciesID: 42,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.WORLDDROP,
    locations: [LOCATIONS.HF],
    chance: 0.05,
    flavor: "Old Alterac saying: 'A cat has nine lives, but needs only one.'",
    icon: 'pet-icons/blacktabbycat.png',
    possibleBreeds: [5],
    baseStats: [6.5, 9, 8.5],
    image: 'pets/black_tabby.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'Orange Tabby Cat',
    speciesID: 43,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      'The last person who tried to housebreak this cat quickly learned that a soiled rug is better than a shredded everything-else.',
    icon: 'pet-icons/orangetabbycat.png',
    possibleBreeds: [1],
    baseStats: [7, 9, 8],
    image: 'pets/orange_tabby.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'Siamese Cat',
    speciesID: 44,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      'Known for its blue eyes. Also considered a delicacy by giant murlocs.',
    icon: 'pet-icons/siamesecat.png',
    possibleBreeds: [3],
    baseStats: [7, 8.5, 8.5],
    image: 'pets/siamese_cat.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'Silver Tabby Cat',
    speciesID: 45,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      "Sleeping is this cat's second favorite activity. The first is yawning.",
    icon: 'pet-icons/silvertabbycat.png',
    possibleBreeds: [1],
    baseStats: [7, 8.5, 8.5],
    image: 'pets/silver_tabby.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
  {
    name: 'White Kitten',
    speciesID: 46,
    type: 8,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      'The queen had three kittens. The first gave her a juicy rat. The second, a tasty hare. And the white, her favorite, presented the head of her rival.',
    icon: 'pet-icons/silvertabbycat.png',
    possibleBreeds: [10],
    baseStats: [7.5, 7.5, 9],
    image: 'pets/silver_tabby.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Claw',
          lvl10: 'Pounce',
        },
        slot2: {
          lvl2: 'Rake',
          lvl15: 'Screech',
        },
        slot3: {
          lvl4: 'Devour',
          lvl20: 'Prowl',
        },
      },
    ],
  },
];
