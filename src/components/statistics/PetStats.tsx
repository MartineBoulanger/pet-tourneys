'use client';

import { useEffect, useState } from 'react';
import { TournamentPetStat } from '@/utils/types';
import { getTournamentPetStats } from '@/supabase/actions/pet-usage-statistics';
import { PetStatList } from './PetStatList';

export function PetStats({ tournamentId }: { tournamentId: string }) {
  const [petStats, setPetStats] = useState<TournamentPetStat[]>([]);

  useEffect(() => {
    async function fetchPetStats() {
      const stats = await getTournamentPetStats(tournamentId);
      setPetStats(stats);
    }
    fetchPetStats();
  }, [tournamentId]);

  return <PetStatList petStats={petStats} />;
}
