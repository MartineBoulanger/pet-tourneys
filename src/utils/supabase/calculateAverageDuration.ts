import { BattleLog } from '@/types/supabase.types';

// =================================================
// Helper function for the battle logs actions
// - calculating average duration time per battle
// =================================================
export function calculateAverageDuration(battles: BattleLog[]): string {
  if (battles.length === 0) return 'N/A';

  const totalSeconds = battles.reduce((sum, battle) => {
    if (!battle.duration) return sum;

    const minutesMatch = battle.duration.match(/(\d+)\s*m/);
    const secondsMatch = battle.duration.match(/(\d+)\s*s/);

    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;

    return sum + minutes * 60 + seconds;
  }, 0);

  const averageSeconds = totalSeconds / battles.length;
  const mins = Math.floor(averageSeconds / 60);
  const secs = Math.round(averageSeconds % 60);

  return `${mins}m ${secs}s`;
}
