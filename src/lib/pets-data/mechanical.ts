import {
  PetData,
  PET_SOURCES,
  PROFESSIONS,
  EXPANSIONS,
  LOCATIONS,
} from './types';

export const mechanical_pets: PetData[] = [
  {
    name: 'Mechanical Squirrel',
    speciesID: 39,
    type: 10,
    isTradable: true,
    source: PET_SOURCES.PROFESSION,
    professionDetails: {
      profession: PROFESSIONS.ENG,
      expansion: EXPANSIONS.CLASSIC75,
      recipeId: 3928,
    },
    flavor:
      "A mechanical squirrel's logic center tells it to collect and store both nuts and bolts for the winter.",
    icon: 'pet-icons/mechanicalsquirrel.png',
    possibleBreeds: [9],
    baseStats: [8.5, 7.5, 8],
    image: 'pets/mechanical_squirrel.jpg',
    abilities: [
      {
        slot1: {
          lvl1: 'Metal Fist',
          lvl10: 'Trash',
        },
        slot2: {
          lvl2: 'Overtune',
          lvl15: 'Extra Plating',
        },
        slot3: {
          lvl4: 'Wind-Up',
          lvl20: 'Repair',
        },
      },
    ],
  },
];
