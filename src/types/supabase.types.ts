import { CloudinaryImage } from './cloudinary.types';
import { PetsDB, Constants as PetsConstants } from './pets.types';
import { CmsDB } from './cms.types';

// =================================================
// color palette for general use
// - also not an enum as it is an array
// =================================================
export const COLORS = [
  '#11a7f6',
  '#81C784',
  '#FFBB28',
  '#FF8042',
  '#d52824',
  '#F06292',
  '#a56dfd',
];

// =================================================
// Enums
// - local enums for all schemas
// =================================================
export enum SCHEMA {
  API = 'api',
  BRACKETS = 'brackets',
  PETS = 'pets',
  CMS = 'cms',
  PUBLIC = 'public',
}

export enum FLAGS {
  eu = 'eu',
  na = 'us',
  oce = 'au',
  cn = 'cn',
}

// =================================================
// Define images for types (extend as needed)
// =================================================
export enum PET_TYPE_IMAGES {
  Aquatic = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/aquatic.png',
  Beast = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/beast.png',
  Critter = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/critter.png',
  Dragonkin = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700958/pml-images/dragonkin.png',
  Elemental = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700958/pml-images/elemental.png',
  Flying = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/flying.png',
  Humanoid = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/humanoid.png',
  Magic = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/magic.png',
  Mechanical = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/mechanical.png',
  Undead = 'https://res.cloudinary.com/dubqvghx7/image/upload/v1759700957/pml-images/undead.png',
}

// =================================================
// Define color palette for types (extend as needed)
// =================================================
export enum PET_TYPE_COLORS {
  Beast = '#d52824',
  Dragonkin = '#2d9318',
  Elemental = '#f9b307',
  Undead = '#92646c',
  Mechanical = '#99988f',
  Humanoid = '#11a7f6',
  Magic = '#a56dfd',
  Aquatic = '#10abb2',
  Flying = '#dfcf5b',
  Critter = '#775845',
}

export enum REGIONS_COLORS {
  EU = '#11a7f6',
  NA = '#d52824',
  OCE = '#2d9318',
  CN = '#FFBB28',
  Finals = '#a56dfd',
}

export enum RESULTS_COLORS {
  WINS = '#016630',
  LOSSES = '#9f0712',
  DRAWS = '#894b00',
}

export enum MATCH_RESULTS_COLORS {
  '3:0' = '#81C784',
  '3:1' = '#a56dfd',
  '3:2' = '#FF8042',
  '4:0' = '#4ECDC4',
  '4:1' = '#FFA07A',
  '4:2' = '#FFD54F',
  '4:3' = '#F06292',
  '5:0' = '#10abb2',
  '5:1' = '#dfcf5b',
  '5:2' = '#2d9318',
  '5:3' = '#11a7f6',
  '5:4' = '#FF6B6B',
}

export enum BREED_COLORS {
  'S/S' = '#FF6B6B',
  'P/P' = '#4ECDC4',
  'H/H' = '#45B7D1',
  'B/B' = '#FFA07A',
  'P/S' = '#98D8C8',
  'S/B' = '#F06292',
  'P/B' = '#81C784',
  'H/S' = '#64B5F6',
  'H/P' = '#BA68C8',
  'H/B' = '#FFD54F',
}

export enum SWAPS_COLORS {
  player = '#2563eb',
  opponent = '#dc2626',
}

export enum WEATHER_COLORS {
  'Scorched Earth' = '#d52824',
  'Cleansing Rain' = '#45B7D1',
  Sandstorm = '#FFD54F',
  'Arcane Winds' = '#BA68C8',
  Blizzard = '#64B5F6',
  'Lightning Storm' = '#11a7f6',
  Darkness = '#a56dfd',
  Moonlight = '#98D8C8',
  'Sunny Day' = '#dfcf5b',
  Mudslide = '#775845',
  'Toxic Gas' = '#2d9318',
}

// =================================================
// Local types for the api schema
// =================================================
export type Profile = {
  avatar_url: string | null;
  created_at: string | null;
  discord_id: string | null;
  email: string;
  id: string;
  role: string | null;
  updated_at: string | null;
  username: string;
};

export type Action = 'create' | 'drop';

export type League = {
  created_at: string | null;
  end_date: string | null;
  id: string;
  name: string;
  participant_count: number;
  start_date: string;
  updated_at: string | null;
};

export type Match = {
  created_at: string | null;
  date: string;
  id: string;
  is_forfeit: boolean | null;
  opponent_score: number | null;
  outcome: string | null;
  owner: string;
  owner_score: number | null;
  player1: string;
  player2: string;
  region: string;
};

export type UploadFormProps = {
  leagues: League[];
  initialData?: {
    player1: string;
    player2: string;
    owner: string;
    date: string;
    logs: string;
    petUsage: string;
    tournament_id: string;
    region: string;
  };
  match_id?: string;
  isEditMode?: boolean;
};

export type PlayerRecord = {
  playerName: string;
  wins: number;
  losses: number;
  winRate: number;
  region: string;
};

export type PetStats = {
  petName: string;
  timesUsed: number;
  kills: number;
  deaths: number;
};

export type OpponentPetStats = {
  petName: string;
  timesLostAgainst: number;
};

export type PlayerMatch = {
  id: string;
  opponent: string;
  owner_score: number;
  opponent_score: number;
  date: string;
};

export type EnhancedPlayerRecord = PlayerRecord & {
  mostUsedPet: PetStats;
  mostProblematicPet: OpponentPetStats;
  petStatistics: PetStats[];
  matches: PlayerMatch[];
  forfeitOnly: boolean;
  pets: Pet[];
};

export type TableName =
  | 'matches'
  | 'battle_logs'
  | 'pet_usage'
  | 'tournament_pet_stats';

export type BattleRound = {
  round: number;
  events: string[];
};

export type BattleLog = {
  battle: BattleRound[];
  created_at: string | null;
  duration: string;
  id?: string;
  match_id?: string;
  opponent_team: string[];
  player_team: string[];
  result: string;
  rounds: number;
  timestamp: string;
};

export type AbilityCategories = {
  damage: string[];
  burst_damage: string[];
  healing: string[];
  dot: string[];
  hot: string[];
  damage_and_dot: string[];
  team_damage: string[];
  team_dot: string[];
  team_healing: string[];
  life_steal: string[];
  damage_from_backline: string[];
  force_swaps: string[];
  persists_through_swaps: string[];
  interrupt: string[];
  block: string[];
  dodge: string[];
  evasion: string[];
  silence: string[];
  root: string[];
  thorn: string[];
  transformation: string[];
  trap: string[];
  recoil: string[];
  minion_summoning: string[];
  remove_objects: string[];
  purges_buffs_and_debuffs: string[];
  always_first: string[];
  always_hits: string[];
  always_kills: string[];
  becomes_unkillable: string[];
  self_damage: string[];
  weather: string[];
  multiple_attacks: string[];
  best_when_first: string[];
  best_when_last: string[];
  multiple_rounds: string[];
  greater_chance_to_miss: string[];
  cumulative_effects: string[];
  aquatic: string[];
  beast: string[];
  critter: string[];
  dragonkin: string[];
  elemental: string[];
  flying: string[];
  humanoid: string[];
  magic: string[];
  mechanical: string[];
  undead: string[];
  bonus_during_arcane_winds: string[];
  bonus_during_blizzard: string[];
  bonus_during_cleansing_rain: string[];
  bonus_during_darkness: string[];
  bonus_during_lightning_storm: string[];
  bonus_during_moonlight: string[];
  bonus_during_sunny_day: string[];
  causes_bleeding: string[];
  causes_blinded: string[];
  causes_burning: string[];
  causes_chilled: string[];
  causes_poisoned: string[];
  causes_sleep: string[];
  causes_stunned: string[];
  causes_toxic_gas: string[];
  causes_webbed: string[];
  bonus_to_bleeding: string[];
  bonus_to_blinded: string[];
  bonus_to_burning: string[];
  bonus_to_chilled: string[];
  bonus_to_low_health: string[];
  bonus_to_poisoned: string[];
  bonus_to_stunned: string[];
  bonus_to_toxic_gas: string[];
  bonus_to_webbed: string[];
  accuracy_debuff: string[];
  critical_strike_debuff: string[];
  damage_debuff: string[];
  increased_damage_debuff: string[];
  reduced_healing_debuff: string[];
  speed_debuff: string[];
  team_debuff: string[];
  accuracy_buff: string[];
  critical_strike_buff: string[];
  damage_buff: string[];
  damage_reduction_buff: string[];
  dodge_buff: string[];
  healing_buff: string[];
  hit_point_buff: string[];
  speed_buff: string[];
  team_buff: string[];
};

export type BattleStatistics = {
  totalPetSwaps: Record<string, number>;
  petSwapDetails: Record<string, number>;
  weatherChanges: {
    total: number;
    byType: Record<string, number>;
  };
  totalWeatherChanges: number;
  totalDeaths: number;
  totalKills: number;
  petPerformance: Record<
    string,
    {
      deaths: number;
      kills: number;
    }
  >;
};

export type ActivePets = {
  player: string | null;
  opponent: string | null;
};

export type AbilityAnalysisResult = AbilityCategories & {
  categorizationLog?: { [ability: string]: string[] };
  totalUniqueAbilitiesUsed?: number;
};

export type BattleLogsStats = {
  generalStats: {
    averageDuration: string;
    totalBattles: number;
    totalMatches: number;
    matchesByRegion: {
      name: string;
      value: number;
    }[];
    battleResults: {
      name: string;
      value: number;
    }[];
    matchResults: {
      name: string;
      value: number;
    }[];
  };
  petStats: Array<{
    name: string;
    count: number;
    playerCount: number;
    opponentCount: number;
    team: 'player' | 'opponent' | 'both';
  }>;
  abilityStats: AbilityAnalysisResult;
  battleStats: BattleStatistics;
};

export type LeaguePetData = {
  pet_data: {
    name: string;
    type: string;
    stats: string[];
    breeds: string[];
    times_played: number[];
    wins?: number;
    losses?: number;
  };
  total_played: number;
};

export type PetUsage = LeaguePetData & {
  id: string;
  match_id: string;
};

export type BreedStats = {
  breed: string;
  stats: string;
  times_played: number;
  wins?: number;
  losses?: number;
};

export type LeaguePetStat = LeaguePetData & {
  id: string;
  breed_stats: BreedStats[];
  match_count: number;
  wins?: number;
  losses?: number;
  win_rate?: number;
  w_l?: string;
};

export type PetUsageData = {
  name: string;
  type: string;
  stats: string[];
  breeds: string[];
  times_played: number[];
};

export type UploadProps = {
  player1: string;
  player2: string;
  owner: string;
  date?: string;
  logs?: string;
  petUsage?: string;
  tournament_id: string;
  region: string;
  is_forfeit?: boolean;
};

export type StatDistribution = {
  health: Record<number, number>;
  power: Record<number, number>;
  speed: Record<number, number>;
};

// =================================================
// Local types for the pets schema
// =================================================
export type Pet = Omit<
  PetsDB['pets']['Tables']['pets']['Row'],
  'image' | 'icon'
> & {
  image: CloudinaryImage | null;
  icon: CloudinaryImage | null;
};

export type PetType = PetsDB['pets']['Enums']['types'];
export type PetBreed = PetsDB['pets']['Enums']['breeds'];
export type PetSource = PetsDB['pets']['Enums']['sources'];
export type PetExpansion = PetsDB['pets']['Enums']['expansions'];

export type PetsManagerProps = {
  initialPets?: Pet[] | null;
  path: string;
};

export type PetsToolbarProps = {
  pets: Pet[];
  setPets: (pets: Pet[]) => void;
  selected: number[];
  setSelected: (selected: number[]) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onBulkDelete: (ids: number[]) => void;
};

export type PetsLayoutProps = {
  pets: Pet[];
  selected: number[];
  setSelected: (selected: number[]) => void;
  viewMode: 'grid' | 'list';
  onView: (pet: Pet) => void;
  onEdit: (pet: Pet) => void;
  onDelete: (petId: number) => void;
};

export type PetModalProps = {
  pet: Pet;
  onClose: () => void;
  onEdit: (pet: Pet) => void;
  onDelete: (petId: number) => void;
};

export type PetCardProps = {
  pet: Pet;
  selected: number[];
  toggleSelect: (id: number) => void;
  onView: (pet: Pet) => void;
  onEdit: (pet: Pet) => void;
  viewMode: 'grid' | 'list';
  onDelete: (id: number) => void;
};

export type PetData = {
  id: number;
  name: string;
  type: PetType;
  expansion: PetExpansion;
  is_tradable?: boolean | null;
  is_capturable?: boolean | null;
  is_vanity?: boolean | null;
  is_horde?: boolean | null;
  is_alliance?: boolean | null;
  ability_1?: string | null;
  ability_2?: string | null;
  ability_3?: string | null;
  ability_4?: string | null;
  ability_5?: string | null;
  ability_6?: string | null;
  base_health?: number | null;
  base_power?: number | null;
  base_speed?: number | null;
  breeds?: PetBreed[] | null;
  source?: PetSource | null;
  icon?: CloudinaryImage | null;
  image?: CloudinaryImage | null;
  description?: string | null;
};

export type ExcelPetRow = {
  'Pet ID': string;
  Name: string;
  Type: string;
  Tradable: string;
  'Ability 1': string;
  'Ability 2': string;
  'Ability 3': string;
  'Ability 4': string;
  'Ability 5': string;
  'Ability 6': string;
  'Base Health': string;
  'Base Power': string;
  'Base Speed': string;
  'Available Breeds': string;
  Source: string;
  Capturable: string;
  Expansion: string;
  'Horde Only': string;
  'Alliance Only': string;
  Vanity: string;
  Description: string;
  Icon: string;
  Image: string;
};

export type UpdateMode = 'skip' | 'update' | 'overwrite';
export const VALID_BREEDS = PetsConstants['pets']['Enums']['breeds'];
export type ValidBreed = (typeof VALID_BREEDS)[number];

// =================================================
// Local types for the cms schema
// =================================================
export type Announcement = Omit<
  CmsDB['cms']['Tables']['announcements']['Row'],
  'image'
> & {
  image?: CloudinaryImage | null;
};

export type SignupImage = {
  image?: CloudinaryImage | null;
  imageName: string;
  imageAlt?: string;
  signupUrl: string;
  order?: number;
};
export type Signup = Omit<
  CmsDB['cms']['Tables']['signups']['Row'],
  'images'
> & {
  images: SignupImage[];
};

export type ScheduleImage = {
  image?: CloudinaryImage | null;
  imageName: string;
  imageDate: string;
  order?: number;
};
export type Schedule = Omit<
  CmsDB['cms']['Tables']['schedules']['Row'],
  'images'
> & {
  images: ScheduleImage[];
};

export type Resource = Omit<
  CmsDB['cms']['Tables']['resources']['Row'],
  'images'
> & {
  images?: CloudinaryImage[] | null;
};

export type Section = {
  type: 'text' | 'image' | 'video' | 'text-image' | 'text-video';
  layout: 'full-width' | 'two-column';
  text?: string;
  textAlign: 'left' | 'center' | 'right';
  image?: CloudinaryImage | null;
  videoUrl?: string;
  order: number;
};
export type Page = Omit<
  CmsDB['cms']['Tables']['pages']['Row'],
  'bannerImage' | 'sections'
> & {
  bannerimage?: CloudinaryImage | null;
  sections: Section[];
};

export type Comment = CmsDB['cms']['Tables']['comments']['Row'];

export type Prize = Omit<CmsDB['cms']['Tables']['prizes']['Row'], 'images'> & {
  images?: CloudinaryImage[] | null;
};

export type Rule = Omit<CmsDB['cms']['Tables']['rules']['Row'], 'images'> & {
  images?: CloudinaryImage[] | null;
};

export type HallOfFame = Omit<
  CmsDB['cms']['Tables']['halloffame']['Row'],
  'avatar' | 'petavatar'
> & {
  avatar?: CloudinaryImage | null;
  petavatar?: CloudinaryImage | null;
};

export type Partner = Omit<
  CmsDB['cms']['Tables']['partners']['Row'],
  'image'
> & {
  image: CloudinaryImage | null;
};

// =================================================
// Local types for other components
// =================================================
export type PlayerRankingsData = {
  records: EnhancedPlayerRecord[];
  regions: string[];
};

export type ChartDataItem = {
  name: string;
  value: number;
};

export type ChartsProps<T> = {
  data: T[] | undefined;
};

export type PetStatsListProps = {
  petData: Pet[];
  petStats: LeaguePetStat[];
  battleStats?: BattleStatistics;
  isMatchView?: boolean;
};

export type PetBattleLogProps = {
  battleStats: BattleStatistics;
  isMatchView?: boolean;
};

export type PetUsageChartData = ChartDataItem & {
  stats: string[];
  type: string;
  breeds: string[];
  total_played: number;
};

export type ChartData = {
  petUsageData: Array<PetUsageChartData>;
  petTypeData: Array<ChartDataItem>;
  petBreedData: Array<ChartDataItem>;
};

// =================================================
// Local types for the pets page
// =================================================
export type PetFilters = {
  type: string;
  expansion: string;
  source: string;
  breed: string;
  tradable: boolean;
  capturable: boolean;
  isAllianceOnly: boolean;
  isHordeOnly: boolean;
  isVanity: boolean;
};

export type UniqueStats = {
  types: string[];
  expansions: string[];
  sources: string[];
  breeds: string[];
};
