export const PETS_PER_PAGE = 20;
export const MATCHES_PER_PAGE = 10;
export const ROUNDS_PER_PAGE = 5;

// Define color palette for breeds (extend as needed)
export const breedColors = {
  'S/S': '#FF6B6B',
  'P/P': '#4ECDC4',
  'H/H': '#45B7D1',
  'B/B': '#FFA07A',
  'P/S': '#98D8C8',
  'S/B': '#F06292',
  'P/B': '#81C784',
  'H/S': '#64B5F6',
  'H/P': '#BA68C8',
  'H/B': '#FFD54F',
};
// Define color palette for types (extend as needed)
export const petTypeColors = {
  Beast: '#d52824',
  Dragonkin: '#2d9318',
  Elemental: '#f9b307',
  Undead: '#92646c',
  Mechanical: '#99988f',
  Humanoid: '#11a7f6',
  Magic: '#a56dfd',
  Aquatic: '#10abb2',
  Flying: '#dfcf5b',
  Critter: '#775845',
};

// List of abilities to exclude -> like effects from abilities or from the pet types
export const EXCLUDED_ABILITIES = new Set([
  'Battle Recovery',
  'Turret',
  'Stunned',
  'Partially Blinded',
  'Resilient',
  'Reforging',
  'Leaping',
  'Sting',
  'Bleeding',
  'Speed Reduction',
  'Underwater',
  'Poisoned',
  'Shattered Defenses',
  'Failsafe', // pet type effect - Mechanical
  'Damned', // pet type effect - Undead
  'Undead', // pet type effect - Undead
  'Magic', // pet type effect - Magic
  'Recovery', // pet type effect - Humanoid
  'Dragonkin', // pet type effect - Dragonkin
  'Toxic Gas', // name of the weather, not the name of the ability
  'Sunny Day', // name of the weather, not the name of the ability
  'Arcane Winds', // name of the weather, not the name of the ability
  // TODO: add all other ability effects and pet type effects here!!
]);
