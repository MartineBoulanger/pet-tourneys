export interface BattleRound {
  round: number;
  events: string[];
}

export interface BattleLog {
  id?: string;
  match_id?: string;
  timestamp: string;
  result: 'WIN' | 'LOSS' | 'DRAW' | string;
  duration: string;
  rounds: number;
  player_team: string[];
  opponent_team: string[];
  battle: BattleRound[];
}

export interface PetUsageData {
  name: string;
  type: string;
  stats: string[];
  breeds: string[];
  times_played: number[];
}

export interface ActivePets {
  player: string | null;
  opponent: string | null;
}

export interface BattleStatistics {
  totalPetSwaps: Record<string, number>;
  petSwapDetails: Record<string, number>;
  weatherChanges: {
    total: number;
    byType: Record<string, number>;
  };
  totalWeatherChanges: number;
  totalDeaths: number;
  totalKills: number;
  petPerformance: Record<
    string,
    {
      deaths: number;
      kills: number;
    }
  >;
}

export interface BreedStats {
  breed: string;
  stats: string;
  times_played: number;
  wins?: number;
  losses?: number;
}

export interface StatDistribution {
  health: Record<number, number>;
  power: Record<number, number>;
  speed: Record<number, number>;
}

export interface PetData {
  pet_data: {
    name: string;
    type: string;
    stats: string[];
    breeds: string[];
    times_played: number[];
    wins?: number;
    losses?: number;
  };
  total_played: number;
}

export interface TournamentPetStat extends PetData {
  id: string;
  breed_stats: BreedStats[];
  match_count: number;
  wins?: number;
  losses?: number;
  win_rate?: number;
  w_l?: string;
}

export interface AbilityCategories {
  damage: string[];
  burst_damage: string[];
  healing: string[];
  dot: string[];
  hot: string[];
  damage_and_dot: string[];
  team_damage: string[];
  team_dot: string[];
  team_healing: string[];
  life_steal: string[];
  damage_from_backline: string[];
  force_swaps: string[];
  persists_through_swaps: string[];
  interrupt: string[];
  block: string[];
  dodge: string[];
  evasion: string[];
  silence: string[];
  root: string[];
  thorn: string[];
  transformation: string[];
  trap: string[];
  recoil: string[];
  minion_summoning: string[];
  remove_objects: string[];
  purges_buffs_and_debuffs: string[];
  always_first: string[];
  always_hits: string[];
  always_kills: string[];
  becomes_unkillable: string[];
  self_damage: string[];
  weather: string[];
  multiple_attacks: string[];
  best_when_first: string[];
  best_when_last: string[];
  multiple_rounds: string[];
  greater_chance_to_miss: string[];
  cumulative_effects: string[];
  aquatic: string[];
  beast: string[];
  critter: string[];
  dragonkin: string[];
  elemental: string[];
  flying: string[];
  humanoid: string[];
  magic: string[];
  mechanical: string[];
  undead: string[];
  bonus_during_arcane_winds: string[];
  bonus_during_blizzard: string[];
  bonus_during_cleansing_rain: string[];
  bonus_during_darkness: string[];
  bonus_during_lightning_storm: string[];
  bonus_during_moonlight: string[];
  bonus_during_sunny_day: string[];
  causes_bleeding: string[];
  causes_blinded: string[];
  causes_burning: string[];
  causes_chilled: string[];
  causes_poisoned: string[];
  causes_sleep: string[];
  causes_stunned: string[];
  causes_toxic_gas: string[];
  causes_webbed: string[];
  bonus_to_bleeding: string[];
  bonus_to_blinded: string[];
  bonus_to_burning: string[];
  bonus_to_chilled: string[];
  bonus_to_low_health: string[];
  bonus_to_poisoned: string[];
  bonus_to_stunned: string[];
  bonus_to_toxic_gas: string[];
  bonus_to_webbed: string[];
  accuracy_debuff: string[];
  critical_strike_debuff: string[];
  damage_debuff: string[];
  increased_damage_debuff: string[];
  reduced_healing_debuff: string[];
  speed_debuff: string[];
  team_debuff: string[];
  accuracy_buff: string[];
  critical_strike_buff: string[];
  damage_buff: string[];
  damage_reduction_buff: string[];
  dodge_buff: string[];
  healing_buff: string[];
  hit_point_buff: string[];
  speed_buff: string[];
  team_buff: string[];
}

export type AbilityAnalysisResult = AbilityCategories & {
  categorizationLog?: { [ability: string]: string[] };
  totalUniqueAbilitiesUsed?: number;
};

export interface BattleLogsStatistics {
  generalStats: {
    averageDuration: string;
    totalBattles: number;
    totalMatches: number;
    matchesByRegion: {
      name: string;
      value: number;
    }[];
    battleResults: {
      name: string;
      value: number;
    }[];
    matchResults: {
      name: string;
      value: number;
    }[];
  };
  petStats: Array<{
    name: string;
    count: number;
    playerCount: number;
    opponentCount: number;
    team: 'player' | 'opponent' | 'both';
  }>;
  abilityStats: AbilityAnalysisResult;
  battleStats: BattleStatistics;
}

export interface UploadProps {
  player1: string;
  player2: string;
  owner: string;
  date: string;
  logs: string;
  petUsage: string;
  tournament_id: string;
  region: string;
}
