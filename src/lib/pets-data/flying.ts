import {
  PetData,
  PET_SOURCES,
  PROFESSIONS,
  EXPANSIONS,
  LOCATIONS,
  DUNGEONS,
} from './types';

export const flying_pets: PetData[] = [
  {
    name: 'Cockatiel',
    speciesID: 47,
    type: 3,
    isTradable: true,
    source: PET_SOURCES.VENDOR,
    flavor:
      "Some say this clever bird can be taught to speak--but it's smart enough to keep its beak shut.",
    icon: 'pet-icons/feather.png',
    possibleBreeds: [1, 3],
    baseStats: [8, 7.5, 8.5],
    image: 'pets/cockatiel.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Slicing Wind',
          lvl10: 'Thrash',
        },
        slot2: {
          lvl2: 'Hawk Eye',
          lvl15: 'Adrenaline Rush',
        },
        slot3: {
          lvl4: 'Lift-Off',
          lvl20: 'Cyclone',
        },
      },
    ],
  },
  {
    name: 'Hyacinth Macaw',
    speciesID: 49,
    type: 3,
    isTradable: true,
    source: PET_SOURCES.WORLDDROP,
    locations: [LOCATIONS.NSTV, LOCATIONS.CSTV],
    chance: 0.1,
    flavor:
      'The jungle trolls train these birds to mimic calls for help in order to lure unsuspecting travelers into traps.',
    icon: 'pet-icons/feather.png',
    possibleBreeds: [1],
    baseStats: [9, 7, 8],
    image: 'pets/hyacinth_macaw.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Slicing Wind',
          lvl10: 'Thrash',
        },
        slot2: {
          lvl2: 'Hawk Eye',
          lvl15: 'Adrenaline Rush',
        },
        slot3: {
          lvl4: 'Lift-Off',
          lvl20: 'Cyclone',
        },
      },
    ],
  },
  {
    name: 'Green Wing Macaw',
    speciesID: 50,
    type: 3,
    isTradable: true,
    source: PET_SOURCES.DROP,
    locations: [DUNGEONS.DM],
    chance: 2,
    flavor:
      'Favored pet of the Defias pirates, this colorful bird is handy for remembering passwords, grocery lists, and cracker recipes.',
    icon: 'pet-icons/feather2.png',
    possibleBreeds: [9],
    baseStats: [9, 8, 7],
    image: 'pets/gw_macaw.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Slicing Wind',
          lvl10: 'Thrash',
        },
        slot2: {
          lvl2: 'Hawk Eye',
          lvl15: 'Adrenaline Rush',
        },
        slot3: {
          lvl4: 'Lift-Off',
          lvl20: 'Cyclone',
        },
      },
    ],
  },
  // Next pet ID to go further with is 51 -> see the Pets.lua from the PetCollector addon
];
