type Abilities = {
  slot1: {
    lvl1: string;
    lvl10: string;
  };
  slot2: {
    lvl2: string;
    lvl15: string;
  };
  slot3: {
    lvl4: string;
    lvl20: string;
  };
};

type ProfessionDetails = {
  profession: string;
  expansion: string;
  recipeId: number;
};

export interface PetData {
  name: string;
  speciesID: number;
  type: number | string;
  isTradable: boolean;
  source: string;
  professionDetails?: ProfessionDetails;
  eventName?: string;
  locations?: string;
  chance?: number;
  flavor?: string;
  icon: string;
  possibleBreeds: number[] | string[];
  baseStats: number[];
  image: string;
  abilities: Abilities[];
}

export enum PET_SOURCES {
  BATTLE = 'Pet Battle',
  PROFESSION = 'Profession',
  VENDOR = 'Vendor',
  WORLDDROP = 'World Drop',
  DROP = 'Drop',
  PARAGON = 'Paragon Reward',
  TCG = 'Trading Card Game',
  PROMOTION = 'Promotion',
  QUEST = 'Quest',
  ACHIEVEMENT = 'Achievement',
  SHOP = 'In-Game Shop',
  WORLDEVENT = 'World Event',
  FISHING = 'Fishing',
  ARCHAEOLOGY = 'Archaeology',
  DISCOVERY = 'Discovery',
  BLACKMARKET = 'Black Market',
  TREASURE = 'Treasure',
  MISSION = 'Mission',
  ORDERHALL = 'Order Hall',
  TRADINGPOST = 'Trading Post',
}

export enum PROFESSIONS {
  ENG = 'Engineering',
}

export enum EXPANSIONS {
  CLASSIC75 = 'Classic 75',
}

export enum LOCATIONS {
  HF = 'Hillsbrad Foothills',
}
