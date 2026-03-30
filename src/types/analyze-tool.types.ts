import { BattleLog, LeaguePetData } from './supabase.types';

// =================================================
// Download PDF type
// =================================================
export type DownloadPDFProps = {
  playerName?: string;
  parsedBattleLogs: BattleLog[];
  parsedPetUsage: LeaguePetData[];
};
