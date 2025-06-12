export const PETS_PER_PAGE = 30;
export const MATCHES_PER_PAGE = 10;
export const TOURNAMENTS_PER_PAGE = 10;
export const PLAYERS_PER_PAGE = 10;
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

// Color palette for general usage
export const COLORS = [
  '#11a7f6',
  '#81C784',
  '#FFBB28',
  '#FF8042',
  '#d52824',
  '#F06292',
  '#a56dfd',
];

// color palette for the battle results
export const resultsColors = {
  WINS: '#016630',
  LOSSES: '#9f0712',
  DRAWS: '#894b00',
};

export const matchResultsColors = {
  '3:0': '#81C784',
  '3:1': '#a56dfd',
  '3:2': '#FF8042',
  '4:0': '#4ECDC4',
  '4:1': '#FFA07A',
  '4:2': '#FFD54F',
  '4:3': '#F06292',
  '5:0': '#10abb2',
  '5:1': '#dfcf5b',
  '5:2': '#2d9318',
  '5:3': '#11a7f6',
  '5:4': '#FF6B6B',
};

export const swapsColors = {
  player: '#2563eb',
  opponent: '#dc2626',
};

// color palette for the match regions
export const regionsColors = {
  EU: '#11a7f6',
  NA: '#d52824',
  OCE: '#2d9318',
  CN: '#FFBB28',
  Other: '#99988f',
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

// color palette for the weather changes
export const weatherColors: Record<string, string> = {
  'Scorched Earth': '#d52824',
  'Cleansing Rain': '#45B7D1',
  Sandstorm: '#FFD54F',
  'Arcane Winds': '#BA68C8',
  Blizzard: '#64B5F6',
  'Lightning Storm': '#11a7f6',
  Darkness: '#a56dfd',
  Moonlight: '#98D8C8',
  'Sunny Day': '#dfcf5b',
  Mudslide: '#775845',
  'Toxic Gas': '#2d9318',
};

// color palette and values names for the oet performance bar chart
export const petPerformanceLegendValues = {
  value1: 'Kills',
  value2: 'Deaths',
};
export const petPerformanceLegendValuesColor = {
  value1: '#11a7f6',
  value2: '#dc2626',
};
// TODO: make sure these colors can be used in the new created generic components for the graphs + fix that navigation goes fast and immediately shows skeletons instead of waiting every time -> probably has to be done with the loading.tsx in each page folder
