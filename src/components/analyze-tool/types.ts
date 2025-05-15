import { BattleLog, PetData } from '@/utils/types';

export interface DownloadPDFProps {
  playerName?: string;
  parsedBattleLogs: BattleLog[];
  parsedPetUsage: PetData[];
}
