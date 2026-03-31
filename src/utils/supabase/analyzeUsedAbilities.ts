import { BattleLog, AbilityCategories } from '@/types/supabase.types';
import { EXCLUDED_ABILITIES } from '@/lib/logs-data/excludedAbilities';
import { allAbilities } from '@/lib/logs-data/allAbilities';

// =================================================
// Helper function for the battle logs actions
// - analyzing the used abilities and list them
// =================================================
export function analyzeUsedAbilities(
  battles: BattleLog[],
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
          /^\[([^\]]+)\](?!.*\[[^\]]+\].*applied|weather)/,
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
