import { PropsWithChildren } from 'react';

export type LuaPrimitive = string | number | boolean | null;

export type LuaValue = LuaPrimitive | LuaTable;

export type LuaTable = {
  [key: string]: LuaValue;
};

export type RematchTeam = {
  id: string;
  name: string;
  npc: string;
  npcId: number | null;
  extraTargets: number;
  pets: string[];
  petTags: string[];
  decodedPetTags: Array<RematchPetTagParts | null>;
  breeds: Array<number | null>;
  abilities: ResolvedPetAbilities[];
  preferences: RematchPreferences;
  groupId: string;
  hasScript: boolean;
  script: string;
  importString: string;
};

export type PetMatchTeam = {
  id: string;
  name: string;
  pets: string[];
  breeds: number[];
  abilities: ResolvedPetAbilities[];
  folderID: string;
  specialSlots: Record<number, PetMatchSpecialSlot>;
  targetNPCIDs: number[];
  script: string;
  notes: string;
  description: string;
  preferences: RematchPreferences;
  strategy: string;
  tags: string[];
  favorite: boolean;
  importSource: 'rematch';
  createdBy: 'PetMatch';
  created: number;
  modified: number;
};

export type RematchTab = {
  id: string;
  name: string;
  color: string | null;
  teams: RematchTeam[];
  exportBlock: string;
};

export type RematchImportData = {
  tabs: RematchTab[];
  teamCount: number;
  scripted: number;
  queue: LevellingQueue | null;
};

export type BattleScriptMap = Record<string, string>;

export type RematchSources = {
  teams: string | null;
  scripts: string | null;
  teamsName: string;
  scriptsName: string;
};

export interface ProcessedRematchTab extends RematchTab {
  shown: RematchTeam[];
}

export interface RematchImportState {
  tabs: ProcessedRematchTab[];
  teamCount: number;
  scripted: number;
}

export interface UseRematchImportResult {
  data: RematchImportData | null;
  queueExport: PmqQueueExport | null;
  petMatchLua: string;
  query: string;
  setQuery: (query: string) => void;
  status: string;
  error: string | null;
  isReading: boolean;
  filteredTabs: RematchImportData['tabs'];
  shownTeamCount: number;
  handleFiles: (files: FileList | File[]) => Promise<void>;
}

export interface FileDropZoneProps {
  onFiles: (files: FileList | File[]) => void;
  disabled?: boolean;
}

export interface TabProps {
  tab: RematchTab;
  forceOpen?: boolean;
}

export interface TeamCardProps {
  team: RematchTeam;
}

export interface PetSlotProps {
  value: string;
}

export interface CopyButtonProps extends PropsWithChildren {
  text: string;
  variant?: 'primary' | 'secondary' | 'link' | 'inverted' | undefined;
}

export interface LevellingQueuePetParts {
  species: number;
  breed: number;
  level: number;
  rarity: number;
}

export type LevellingQueuePet = {
  petID: string;
  tag: string;
  parts: LevellingQueuePetParts | null;
  added: string;
  preferred: boolean;
};

export interface LevellingQueue {
  pets: LevellingQueuePet[];
}

export interface PmqQueuePet {
  species: number;
  breed: number;
  level: number;
  rarity: number;
  type: number;
}

export interface PmqQueueExport {
  pets: PmqQueuePet[];
  string: string;
  missingTypes: number[];
}

export interface LevellingQueueProps {
  queue: LevellingQueue | null;
  exportData: PmqQueueExport | null;
}

export type PetMatchSpecialSlot =
  | {
      type: 'leveling';
      rawPetTag: string;
      minimumLevel?: number;
      maximumLevel?: number;
      minimumHealth?: number;
      level?: number;
      rarity?: number;
    }
  | {
      type: 'random';
      petType: number;
      rawPetTag: string;
      level?: number;
      rarity?: number;
    };

export type RematchPetTagParts =
  | {
      type: 'pet';
      abilities: [number, number, number];
      breed: number;
      species: number;
    }
  | {
      type: 'leveling';
      rawPetTag: string;
    }
  | {
      type: 'random';
      petType: number;
      rawPetTag: string;
    };

export type SpeciesAbilities = [number, number, number, number, number, number];

export type SpeciesAbilityMap = Record<number, SpeciesAbilities>;

export type PetAbilityIds = [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
];

export type PetAbilitiesBySpecies = Record<number, PetAbilityIds>;

export type PetMatchFolder = {
  id: string;
  name: string;
  order: number;
  created: number;
  modified: number;
};

export type PetMatchConvertedData = {
  folders: Record<string, PetMatchFolder>;
  teams: Record<string, PetMatchTeam>;
  levellingQueue: PetMatchLevellingQueue;
};

export type ResolvedPetAbilities = [
  number | null,
  number | null,
  number | null,
];

export type PetMatchLevellingQueue = {
  pets: string[];
  initialized: boolean;
  knownPets: Record<string, boolean>;
};

export type PetMatchSettings = {
  scale: number;
  debug: boolean;
  selectedFolderKey: '__UNSORTED__';
  selectedTeamID: null;
  teamSortMode: 'name';

  ui: {
    theme: 'dark';
    petCardBackground: 'marble';
    compactPetListRows: boolean;
    teamCardHeightMode: 'normal';
    petTypeFilterDisplayMode: 'both';
    petListBreedPosition: 'right';
  };

  duplicateTeamMode: 'replace';
  petCardInteractionMode: 'hover';
  petCardPetListEnabled: boolean;
  petCardTeamsEnabled: boolean;
  petCardLevellingQueueEnabled: boolean;
  petCardTargetEnabled: boolean;
  levellingQueueAutoAddMode: 'disabled';
  summonedPetMode: 'keep';
  restorePreviousSummonedPet: boolean;
  autoOpenNotesOnPvEBattle: boolean;
  autoOpenPetJournalAfterBattle: boolean;
  statusBarClearMode: 'all';
  targetTeamLoadMode: 'off';
};

export type PetMatchProfile = {
  folders: Record<string, PetMatchFolder>;
  teams: Record<string, PetMatchTeam>;
  levellingQueue: PetMatchLevellingQueue;
  settings: PetMatchSettings;
  activeTeam: Record<string, never>;
  tags: Record<string, never>;
  favorites: Record<string, never>;
};

export type PetMatchDatabase = {
  version: number;
  cache: Record<string, never>;
  characters: Record<string, never>;
  profileKeys: Record<string, never>;
  global: {
    settings: Record<string, never>;
  };
  profiles: {
    Default: PetMatchProfile;
  };
};

export type RematchPreferences = {
  minHP?: number;
  allowMM?: boolean;
  expectedDD?: number;
  maxHP?: number;
  minXP?: number;
  maxXP?: number;
};
