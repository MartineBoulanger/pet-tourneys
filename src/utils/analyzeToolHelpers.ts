import {
  BattleLog,
  AbilityCategories,
  BattleStatistics,
  ActivePets,
} from './types';
import { allAbilities, EXCLUDED_ABILITIES } from '@/lib/logs-data';

// Helper functions for analysis
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

// Helper functions for getting to most used pets
export function getMostUsedPets(
  battles: BattleLog[],
  limit = 8
): Array<{
  name: string;
  count: number;
  playerCount: number;
  opponentCount: number;
  team: 'player' | 'opponent' | 'both';
}> {
  const playerPetCounts = new Map<string, number>();
  const opponentPetCounts = new Map<string, number>();

  battles.forEach((battle) => {
    // Count player pets
    battle.player_team?.forEach((pet) => {
      playerPetCounts.set(pet, (playerPetCounts.get(pet) || 0) + 1);
    });

    // Count opponent pets
    battle.opponent_team?.forEach((pet) => {
      opponentPetCounts.set(pet, (opponentPetCounts.get(pet) || 0) + 1);
    });
  });

  // Combine results with team information
  const allPets = new Set([
    ...Array.from(playerPetCounts.keys()),
    ...Array.from(opponentPetCounts.keys()),
  ]);

  const combined = Array.from(allPets).map((pet) => {
    const playerCount = playerPetCounts.get(pet) || 0;
    const opponentCount = opponentPetCounts.get(pet) || 0;
    const total = playerCount + opponentCount;

    let team: 'player' | 'opponent' | 'both' = 'both';
    if (playerCount > 0 && opponentCount === 0) team = 'player';
    if (opponentCount > 0 && playerCount === 0) team = 'opponent';

    return {
      name: pet,
      count: total,
      playerCount,
      opponentCount,
      team,
    };
  });

  return combined
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map(({ name, count, playerCount, opponentCount, team }) => ({
      name,
      count,
      playerCount,
      opponentCount,
      team,
    }));
}

// Helper function to analyze the used pets abilities
export function analyzeUsedAbilities(
  battles: BattleLog[]
): AbilityCategories & {
  categorizationLog?: { [ability: string]: string[] };
  totalUniqueAbilitiesUsed?: number;
} {
  const allUniqueAbilities = new Set<string>();
  const usedAbilities: Record<keyof AbilityCategories, Set<string>> = {
    damage: new Set(),
    burst_damage: new Set(),
    healing: new Set(),
    dot: new Set(),
    hot: new Set(),
    damage_and_dot: new Set(),
    team_damage: new Set(),
    team_dot: new Set(),
    team_healing: new Set(),
    life_steal: new Set(),
    damage_from_backline: new Set(),
    force_swaps: new Set(),
    persists_through_swaps: new Set(),
    interrupt: new Set(),
    block: new Set(),
    dodge: new Set(),
    evasion: new Set(),
    silence: new Set(),
    root: new Set(),
    thorn: new Set(),
    transformation: new Set(),
    trap: new Set(),
    recoil: new Set(),
    minion_summoning: new Set(),
    remove_objects: new Set(),
    purges_buffs_and_debuffs: new Set(),
    always_first: new Set(),
    always_hits: new Set(),
    always_kills: new Set(),
    becomes_unkillable: new Set(),
    self_damage: new Set(),
    weather: new Set(),
    multiple_attacks: new Set(),
    best_when_first: new Set(),
    best_when_last: new Set(),
    multiple_rounds: new Set(),
    greater_chance_to_miss: new Set(),
    cumulative_effects: new Set(),
    aquatic: new Set(),
    beast: new Set(),
    critter: new Set(),
    dragonkin: new Set(),
    elemental: new Set(),
    flying: new Set(),
    humanoid: new Set(),
    magic: new Set(),
    mechanical: new Set(),
    undead: new Set(),
    bonus_during_arcane_winds: new Set(),
    bonus_during_blizzard: new Set(),
    bonus_during_cleansing_rain: new Set(),
    bonus_during_darkness: new Set(),
    bonus_during_lightning_storm: new Set(),
    bonus_during_moonlight: new Set(),
    bonus_during_sunny_day: new Set(),
    causes_bleeding: new Set(),
    causes_blinded: new Set(),
    causes_burning: new Set(),
    causes_chilled: new Set(),
    causes_poisoned: new Set(),
    causes_sleep: new Set(),
    causes_stunned: new Set(),
    causes_toxic_gas: new Set(),
    causes_webbed: new Set(),
    bonus_to_bleeding: new Set(),
    bonus_to_blinded: new Set(),
    bonus_to_burning: new Set(),
    bonus_to_chilled: new Set(),
    bonus_to_low_health: new Set(),
    bonus_to_poisoned: new Set(),
    bonus_to_stunned: new Set(),
    bonus_to_toxic_gas: new Set(),
    bonus_to_webbed: new Set(),
    accuracy_debuff: new Set(),
    critical_strike_debuff: new Set(),
    damage_debuff: new Set(),
    increased_damage_debuff: new Set(),
    reduced_healing_debuff: new Set(),
    speed_debuff: new Set(),
    team_debuff: new Set(),
    accuracy_buff: new Set(),
    critical_strike_buff: new Set(),
    damage_buff: new Set(),
    damage_reduction_buff: new Set(),
    dodge_buff: new Set(),
    healing_buff: new Set(),
    hit_point_buff: new Set(),
    speed_buff: new Set(),
    team_buff: new Set(),
  };

  const categorizationLog: { [ability: string]: string[] } = {};

  battles.forEach((battle) => {
    battle.battle?.forEach((round) => {
      round.events?.forEach((event) => {
        if (typeof event !== 'string') return;

        const abilityMatch = event.match(
          /^\[([^\]]+)\](?!.*\[[^\]]+\].*applied|weather)/
        );

        if (!abilityMatch?.[1] || EXCLUDED_ABILITIES.has(abilityMatch[1])) {
          return;
        }

        const ability = abilityMatch[1];
        allUniqueAbilities.add(ability);

        if (event.includes('] fades')) {
          return;
        }

        for (const [category, abilities] of Object.entries(allAbilities)) {
          if (abilities.includes(ability)) {
            (
              usedAbilities[category as keyof AbilityCategories] as Set<string>
            ).add(ability);
          }
        }
      });
    });
  });

  const result: AbilityCategories = {} as AbilityCategories;

  for (const [category, abilitiesSet] of Object.entries(usedAbilities)) {
    result[category as keyof AbilityCategories] =
      Array.from(abilitiesSet).sort();
  }

  return {
    ...result,
    categorizationLog,
    totalUniqueAbilitiesUsed: allUniqueAbilities.size,
  };
}

// The abilities category names
export const abilitiesCategoryNames: Record<keyof AbilityCategories, string> = {
  damage: 'Damage',
  burst_damage: 'Burst Damage',
  weather: 'Weather',
  dot: 'DoT',
  damage_and_dot: 'Damage & DoT',
  team_damage: 'Team Damage',
  team_dot: 'Team DoT',
  self_damage: 'Self Damage',
  always_first: 'Always First',
  always_hits: 'Always Hits',
  always_kills: 'Always Kills',
  damage_from_backline: 'Damage From Backline',
  life_steal: 'Life Steal',
  healing: 'Healing',
  hot: 'HoT',
  team_healing: 'Team Healing',
  force_swaps: 'Force Swaps',
  interrupt: 'Interrupt',
  recoil: 'Recoil',
  remove_objects: 'Removes Objects',
  multiple_attacks: 'Multiple Attacks (2+)',
  best_when_first: 'Best When First',
  best_when_last: 'Best When Last',
  multiple_rounds: 'Multiple Rounds',
  persists_through_swaps: 'Persist Through Swaps',
  block: 'Block',
  dodge: 'Dodge',
  evasion: 'Evasion',
  silence: 'Silence',
  root: 'Root',
  thorn: 'Thorn',
  transformation: 'Transform',
  trap: 'Trap',
  minion_summoning: 'Minion/Object Summoning',
  purges_buffs_and_debuffs: 'Purges Buffs/Debuffs',
  becomes_unkillable: 'Becomes Unkillable',
  greater_chance_to_miss: 'Greater Miss Chance',
  cumulative_effects: 'Cumulative Effects',
  aquatic: 'Aquatic Abilities',
  beast: 'Beast Abilities',
  critter: 'Critter Abilities',
  dragonkin: 'Dragonkin Abilities',
  elemental: 'Elemental Abilities',
  flying: 'Flying Abilities',
  humanoid: 'Humanoid Abilities',
  magic: 'Magic Abilities',
  mechanical: 'Mechanical Abilities',
  undead: 'Undead Abilities',
  bonus_during_arcane_winds: 'Bonus During Arcane Winds',
  bonus_during_blizzard: 'Bonus During Blizzard',
  bonus_during_cleansing_rain: 'Bonus During Cleansing Rain',
  bonus_during_darkness: 'Bonus During Darkness',
  bonus_during_lightning_storm: 'Bonus During Lightning Storm',
  bonus_during_moonlight: 'Bonus During Moonlight',
  bonus_during_sunny_day: 'Bonus During Sunny Day',
  causes_bleeding: 'Causes Bleeding',
  causes_blinded: 'Causes Blinded',
  causes_burning: 'Causes Burning',
  causes_chilled: 'Causes Chilled',
  causes_poisoned: 'Causes Poisoned',
  causes_sleep: 'Causes Sleep',
  causes_stunned: 'Causes Stunned',
  causes_toxic_gas: 'Causes Toxic Gas',
  causes_webbed: 'Causes Webbed',
  bonus_to_bleeding: 'Bonus To Bleeding',
  bonus_to_blinded: 'Bonus To Blinded',
  bonus_to_burning: 'Bonus To Burning',
  bonus_to_chilled: 'Bonus To Chilled',
  bonus_to_low_health: 'Bonus To Low Health',
  bonus_to_poisoned: 'Bonus To Poisoned',
  bonus_to_stunned: 'Bonus To Stunned',
  bonus_to_toxic_gas: 'Bonus To Toxic Gas',
  bonus_to_webbed: 'Bonus To Webbed',
  accuracy_debuff: 'Accuracy Debuff',
  critical_strike_debuff: 'Crit Strike Debuff',
  damage_debuff: 'Damage Debuff',
  increased_damage_debuff: 'Increased Damage Debuff',
  reduced_healing_debuff: 'Reduced Healing Debuff',
  speed_debuff: 'Speed Debuff',
  team_debuff: 'Team Debuff',
  accuracy_buff: 'Accuracy Buff',
  critical_strike_buff: 'Crit Strike Buff',
  damage_buff: 'Damage Buff',
  damage_reduction_buff: 'Damage Reduction Buff',
  dodge_buff: 'Dodge Buff',
  healing_buff: 'Healing Buff',
  hit_point_buff: 'Hit Point Buff',
  speed_buff: 'Speed Buff',
  team_buff: 'Team Buff',
};

// Helper function to normalize pet names
function normalizePetName(name: string): string {
  // Remove trailing period if it's not part of the actual name
  return name.replace(/\.$/, '');
}

// Helper function to extract the pet name from the events
function extractPetName(
  event: string,
  context: 'resurrection' | 'death' | 'swap'
): string | null {
  let match;
  if (context === 'resurrection') {
    // New precise resurrection pattern
    match = event.match(
      /(?:applied \[(?:Undead|Mechanical)\] to (?:your|enemy) )([^[\]\.]+(?:\.[^[\]\.]+)*)/
    );
  } else if (context === 'death') {
    // Death pattern
    match = event.match(
      /(?:Your|Enemy) ([^[\]\.]+(?:\.[^[\]\.]+)*)(?: died|$)/
    );
  } else {
    // Swap pattern
    match = event.match(
      /([^[\]\.]+(?:\.[^[\]\.]+)*)(?: is now (?:your|enemy) active pet|$)/
    );
  }

  const rawName = match?.[1]?.trim();
  return rawName ? normalizePetName(rawName) : null;
}

// Helper function to parse the statistics from the battle logs
export function parseBattleStatistics(
  battles: BattleLog[] = []
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

export function transformPetSwapData(
  petSwapDetails: Record<string, number>
): { name: string; value: number }[] {
  return Object.entries(petSwapDetails)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort by swap count descending
}
