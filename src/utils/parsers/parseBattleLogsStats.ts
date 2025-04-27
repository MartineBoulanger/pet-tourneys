import { BattleLog, BattleStatistics, ActivePets } from '@/types';
import { EXCLUDED_ABILITIES } from '@/types/constants';

export function parseBattleStatistics(
  battles: BattleLog[] = []
): BattleStatistics {
  // Initialize with all possible properties
  const stats: BattleStatistics = {
    totalPetSwaps: {
      player: 0,
      opponent: 0,
    },
    petSwapDetails: {},
    weatherChanges: {
      total: 0,
      byType: {},
    },
    abilityUsage: {},
    petDeaths: {},
    activePetsHistory: [],
    totalAbilityUsage: 0,
    totalWeatherChanges: 0,
    totalDeaths: 0,
    petPerformance: {},
  };

  // Early return if no battles
  if (!battles || battles.length === 0) {
    return stats;
  }

  battles.forEach((battle) => {
    // Skip if battle is invalid
    if (!battle || !battle.battle) return;

    const battlePets = new Set<string>();
    const activePets: ActivePets = { player: null, opponent: null };

    // Safe pet initialization
    const trackPetSwap = (
      pet: string,
      team: 'player' | 'opponent',
      stats: BattleStatistics,
      activePets: ActivePets
    ) => {
      if (!pet) return;

      // Update active pet
      activePets[team] = pet;

      // Update total swaps
      stats.totalPetSwaps[team] = (stats.totalPetSwaps[team] || 0) + 1;

      // Initialize pet details if not exists
      stats.petSwapDetails[pet] = stats.petSwapDetails[pet] || {
        totalSwaps: 0,
        battlesAppeared: 0,
      };

      // Update swap count
      stats.petSwapDetails[pet].totalSwaps += 1;
    };

    // Initialize pet data (appearances)
    battle.player_team?.forEach((pet) => {
      battlePets.add(pet);
      stats.petSwapDetails[pet] = stats.petSwapDetails[pet] || {
        totalSwaps: 0,
        battlesAppeared: 0,
      };
      stats.petSwapDetails[pet].battlesAppeared++;
    });

    battle.opponent_team?.forEach((pet) => {
      battlePets.add(pet);
      stats.petSwapDetails[pet] = stats.petSwapDetails[pet] || {
        totalSwaps: 0,
        battlesAppeared: 0,
      };
      stats.petSwapDetails[pet].battlesAppeared++;
    });

    // Process rounds
    battle.battle.forEach((round) => {
      if (!round || !round.events) return;

      round.events.forEach((event) => {
        if (!event || typeof event !== 'string') return;

        // Player pet swap
        if (event.includes(' is now your active pet')) {
          const petMatch = event.match(/(.+?) is now your active pet/);
          if (petMatch?.[1]) {
            trackPetSwap(petMatch[1], 'player', stats, activePets);
          }
        }
        // Opponent pet swap
        else if (event.includes(' is now enemy active pet')) {
          const petMatch = event.match(/(.+?) is now enemy active pet/);
          if (petMatch?.[1]) {
            trackPetSwap(petMatch[1], 'opponent', stats, activePets);
          }
        }

        // Safe weather change tracking
        if (
          typeof event === 'string' &&
          event.includes(' changed the weather to ')
        ) {
          stats.weatherChanges.total = (stats.weatherChanges.total || 0) + 1;
          stats.totalWeatherChanges = (stats.totalWeatherChanges || 0) + 1;

          const weatherMatch = event.match(/changed the weather to \[(.+?)\]/);
          if (weatherMatch?.[1]) {
            const weather = weatherMatch[1];
            stats.weatherChanges.byType[weather] =
              (stats.weatherChanges.byType[weather] || 0) + 1;
          }
        }

        // ability tracking -> only tracks the ability in the first brackets of the event
        // makes sure that ability effects are not counted
        const abilityMatch = event.match(
          /^\[([^\]]+)\](?!.*\[[^\]]+\].*applied|weather)/
        );
        if (abilityMatch?.[1] && !EXCLUDED_ABILITIES.has(abilityMatch[1])) {
          if (event.includes('] fades')) {
            return;
          }
          const ability = abilityMatch[1];
          stats.totalAbilityUsage = (stats.totalAbilityUsage || 0) + 1;
          stats.abilityUsage[ability] = (stats.abilityUsage[ability] || 0) + 1;
        }

        // Safe death tracking
        if (typeof event === 'string' && event.includes(' died')) {
          stats.totalDeaths = (stats.totalDeaths || 0) + 1;

          const deathMatch = event.match(/(Your|Enemy) (.+?) died/);
          if (deathMatch?.[2]) {
            const pet = deathMatch[2];
            const isPlayerPet = deathMatch[1] === 'Your';

            // Initialize death tracking
            stats.petDeaths[pet] = stats.petDeaths[pet] || {
              totalDeaths: 0,
              deathRound: [],
              battlesAppeared: 0,
            };
            stats.petDeaths[pet].totalDeaths =
              (stats.petDeaths[pet].totalDeaths || 0) + 1;
            stats.petDeaths[pet].deathRound.push(round.round || 0);

            // Update performance stats
            stats.petPerformance[pet] = stats.petPerformance[pet] || {
              totalBattles: 0,
              deaths: 0,
              kills: 0,
            };
            stats.petPerformance[pet].deaths =
              (stats.petPerformance[pet].deaths || 0) + 1;

            // Record kill for opposing pet
            const killer = isPlayerPet
              ? activePets.opponent
              : activePets.player;
            if (killer) {
              stats.petPerformance[killer] = stats.petPerformance[killer] || {
                totalBattles: 0,
                deaths: 0,
                kills: 0,
              };
              stats.petPerformance[killer].kills =
                (stats.petPerformance[killer].kills || 0) + 1;
            }
          }
        }
      });

      // Record active pets if both exist
      if (activePets.player && activePets.opponent) {
        stats.activePetsHistory.push({
          round: round.round || 0,
          playerPet: activePets.player,
          opponentPet: activePets.opponent,
        });
      }
    });
  });

  return stats;
}
