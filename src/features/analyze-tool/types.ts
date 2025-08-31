import { BattleLog, PetData } from '@/features/supabase/types';

export interface DownloadPDFProps {
  playerName?: string;
  parsedBattleLogs: BattleLog[];
  parsedPetUsage: PetData[];
}
