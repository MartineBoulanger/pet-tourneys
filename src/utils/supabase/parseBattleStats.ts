import {
  BattleLog,
  BattleStatistics,
  ActivePets,
} from '@/types/supabase.types';

// =================================================
// Helper function for the battle logs actions
// - to normalize pet names
// =================================================
function normalizePetName(name: string): string {
  // Remove trailing period if it's not part of the actual name
  return name.replace(/\.$/, '');
}

// =================================================
// Helper function for the battle logs actions
// - to extract the pet name from the events
// =================================================
function extractPetName(
  event: string,
  context: 'resurrection' | 'death' | 'swap',
): string | null {
  let match;
  if (context === 'resurrection') {
    // New precise resurrection pattern
    match = event.match(
      /(?:applied \[(?:Undead|Mechanical)\] to (?:your|enemy) )([^[\]\.]+(?:\.[^[\]\.]+)*)/,
    );
  } else if (context === 'death') {
    // Death pattern
    match = event.match(
      /(?:Your|Enemy) ([^[\]\.]+(?:\.[^[\]\.]+)*)(?: died|$)/,
    );
  } else {
    // Swap pattern
    match = event.match(
      /([^[\]\.]+(?:\.[^[\]\.]+)*)(?: is now (?:your|enemy) active pet|$)/,
    );
  }

  const rawName = match?.[1]?.trim();
  return rawName ? normalizePetName(rawName) : null;
}

// =================================================
// Helper function for the battle logs actions
// - parsing the battle statistics
// =================================================
export function parseBattleStatistics(
  battles: BattleLog[] = [],
): BattleStatistics {
  const stats: BattleStatistics = {
    totalPetSwaps: { player: 0, opponent: 0 },
    petSwapDetails: {},
    weatherChanges: { total: 0, byType: {} },
    totalWeatherChanges: 0,
    totalDeaths: 0,
    totalKills: 0,
    petPerformance: {},
  };

  if (!battles?.length) return stats;

  battles.forEach((battle) => {
    if (!battle?.battle) return;

    const battlePets = new Set<string>();
    const activePets: ActivePets = { player: null, opponent: null };
    const resurrectedPets = new Set<string>();

    const trackPetSwap = (pet: string, team: 'player' | 'opponent') => {
      if (!pet) return;
      activePets[team] = pet;
      stats.totalPetSwaps[team]++;
      stats.petSwapDetails[pet] = (stats.petSwapDetails[pet] || 0) + 1;
    };

    // Initialize pet data
    battle.player_team?.forEach((pet) => battlePets.add(pet));
    battle.opponent_team?.forEach((pet) => battlePets.add(pet));

    // Process rounds
    battle.battle.forEach((round) => {
      if (!round?.events) return;

      round.events.forEach((event) => {
        if (typeof event !== 'string') return;

        // Pet swaps
        const swapPetName = extractPetName(event, 'swap');
        if (swapPetName) {
          if (event.includes('your active pet')) {
            trackPetSwap(swapPetName, 'player');
          } else if (event.includes('enemy active pet')) {
            trackPetSwap(swapPetName, 'opponent');
          }
        }

        // Weather changes
        if (event.includes(' changed the weather to ')) {
          stats.weatherChanges.total++;
          stats.totalWeatherChanges++;
          const weather = event.match(/changed the weather to \[(.+?)\]/)?.[1];
          if (weather) {
            stats.weatherChanges.byType[weather] =
              (stats.weatherChanges.byType[weather] || 0) + 1;
          }
        }

        // Track resurrection
        if (
          event.includes(' applied [Undead]') ||
          event.includes(' applied [Mechanical]')
        ) {
          const petName = extractPetName(event, 'resurrection');
          if (petName) {
            resurrectedPets.add(petName);
          }
        }

        // Death tracking
        if (event.includes(' died')) {
          const petName = extractPetName(event, 'death');
          if (!petName) return;

          const isPlayerPet = event.startsWith('Your');
          const isResurrected = resurrectedPets.has(petName);

          // Skip resurrection deaths
          if (isResurrected) {
            resurrectedPets.delete(petName);
            return;
          }

          // Count the death
          stats.petPerformance[petName] = stats.petPerformance[petName] || {
            deaths: 0,
            kills: 0,
          };
          stats.petPerformance[petName].deaths++;
          stats.totalDeaths++;

          // Count the kill
          const killer = isPlayerPet ? activePets.opponent : activePets.player;
          if (killer && killer !== petName) {
            stats.petPerformance[killer] = stats.petPerformance[killer] || {
              deaths: 0,
              kills: 0,
            };
            stats.petPerformance[killer].kills++;
            stats.totalKills++;
          }
        }
      });
    });
  });

  return stats;
}
