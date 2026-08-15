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
  groupId: string;
  hasScript: boolean;
  importString: string;
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
