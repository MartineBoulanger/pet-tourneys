import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLProps,
  InputHTMLAttributes,
  JSX,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { IconType } from 'react-icons';

export type Action = 'create' | 'drop';

export type TournamentTableName =
  | 'matches'
  | 'battle_logs'
  | 'pet_usage'
  | 'tournament_pet_stats';

export type PageParams = Promise<{ id: string }>;
export type MatchPageParams = Promise<{ id: string; matchId: string }>;
export type MatchSearchParams = Promise<{ matchId?: string }>;
export type PageSearchParams = Promise<{ page?: string }>;

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export interface HeadingProps {
  as?: HeadingTags;
  className?: string;
  children: ReactNode;
}

export interface ParagraphProps {
  className?: string;
  children: ReactNode;
}

export interface ChartDataItem {
  name: string;
  value: number;
}
export interface PetUsageChartData extends ChartDataItem {
  stats: string[];
  type: string;
  breeds: string[];
  total_played: number;
}
export interface ChartData {
  petUsageData: PetUsageChartData[];
  petTypeData: ChartDataItem[];
  petBreedData: ChartDataItem[];
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
export interface BreedStats {
  breed: string;
  stats: string;
  times_played: number;
  wins?: number;
  losses?: number;
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
export interface PetUsage extends PetData {
  id: string;
  match_id: string;
}
export interface PetListProps {
  stats: TournamentPetStat[];
  matchView?: boolean;
}
export interface PetUsageData {
  name: string;
  type: string;
  stats: string[];
  breeds: string[];
  times_played: number[];
}

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
export interface BattleLogViewerProps {
  battleLog: BattleLog;
}

export interface Match {
  id: string;
  region: string;
  player1: string;
  player2: string;
  owner: string;
  date: string;
  owner_score: number;
  opponent_score: number;
  outcome: string;
}

export interface MatchScoreProps {
  match: Match;
}

export interface Tournament {
  id: string;
  name: string;
  start_date: string;
  end_date?: string | null;
  participant_count: number;
}

export interface Profile {
  id: string;
  email: string;
  username: string;
  discord_id: string | null;
  avatar_url: string | null;
  role: string;
}

export interface PetStats {
  name: string;
  type: string;
  stats: string[];
  breeds: string[];
  total_played: number;
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
export interface UploadFormProps {
  tournaments: Array<{ id: string; name: string }>;
  initialData?: {
    player1: string;
    player2: string;
    owner: string;
    date: string;
    logs: string;
    petUsage: string;
    tournament_id: string;
    region: string;
  };
  match_id?: string;
  isEditMode?: boolean;
}

export interface BarGraphProps {
  data:
    | {
        name: string;
        type?: string;
        stats?: string[];
        breeds?: string[];
      }[]
    | undefined;
  defaultColor?: string;
  tooltipTextColor?: string;
  tooltipHoverColor?: string;
}
export interface PieGraphProps {
  data: { name: string; value: number }[] | undefined;
  children: ReactNode;
}
export interface LineGraphProps {
  data: { count: number; value: number }[] | undefined;
}

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'secondary' | 'link';
}

export interface ContainerProps {
  className?: string;
  children: ReactNode;
}

export interface FormProps extends HTMLProps<HTMLFormElement> {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  button1?: {
    variant?: 'secondary' | 'link' | 'primary' | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    text?: string;
  };
  button2?: {
    variant?: 'secondary' | 'link' | 'primary' | undefined;
    type?: 'button' | 'submit' | 'reset' | undefined;
    text?: string;
  };
  handleClick?: () => void; // if a onClick is needed, use the button2 prop, only this button has the onClick set
  message?: string;
}

export interface InputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'required' | 'type'
  > {
  label: string;
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local';
  required?: boolean;
}

export interface TextareaProps
  extends Omit<
    DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'required' | 'rows'
  > {
  label: string;
  id: string;
  name: string;
  rows: number;
  required?: boolean;
}

export interface SelectProps
  extends Omit<
    DetailedHTMLProps<
      SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    'required'
  > {
  label: string;
  id: string;
  name: string;
  required?: boolean;
}

export interface FormErrorMessageProps {
  message?: string | undefined | null;
}

export interface PopupProps {
  text?: ReactNode | JSX.Element | string | number;
  children: ReactNode;
  className?: string;
  divClassName?: string;
}

export interface NavigationData {
  id: number;
  url: string;
  linkText: string;
  text: string;
  imageSrc: string;
}

export interface BottomNavigationProps {
  user?: Profile | null;
}

export interface MenuProps {
  className?: string;
  buttonVariant?: 'link' | 'primary' | 'secondary' | undefined;
}

export interface FooterData {
  id: number;
  url: string;
  Icon: IconType;
  name: string;
}

interface LinksData {
  id: number;
  full_url?: string;
  url_prefix?: string;
  url_suffix?: string;
  text?: string;
}

export interface LinksDataArray {
  tournament: LinksData[];
  statistics: LinksData[];
  match: LinksData[];
}

export interface StatDistribution {
  health: Record<number, number>;
  power: Record<number, number>;
  speed: Record<number, number>;
}

export interface PetChartsProps {
  chartData: ChartData;
  stats: TournamentPetStat[];
}

export interface PetBreedChartProps {
  breeds: { name: string; value: number }[] | undefined;
}

export interface PetStatsChartProps {
  pets: TournamentPetStat[];
}

export interface PetTypeChartProps {
  types: { name: string; value: number }[] | undefined;
}

export interface PetUsageChartProps {
  pets: PetUsageChartData[] | undefined;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParam?: string;
  className?: string;
}

export interface AdminMatchListItemProps {
  match: Match;
  tournament: Tournament;
}

export interface DeleteMatchProps {
  tournamentId: string;
  matchId: string;
  player1: string;
  player2: string;
}

export interface DeleteTournamentProps {
  id: string;
  name: string;
}

export interface TournamentsListItemProps {
  tournament: Tournament;
}

export interface TournamentFormProps {
  initialData?: Tournament | null;
}

export interface AuthButtonProps {
  type: 'login' | 'Sign up' | 'Reset Password' | 'Forgot Password';
  loading: boolean;
  className?: string;
}

export interface MatchListProps {
  matches: Match[];
  tournamentId: string;
  currentPage?: number;
  totalPages?: number;
}

export interface MatchListItemProps {
  tournamentId: string;
  match: Match;
}

export interface TournamentsListProps {
  tournaments: Tournament[];
}

export interface PageHeadingProps extends HTMLProps<HTMLElement> {
  heading: string | JSX.Element | React.ReactNode;
}

export interface DownloadPDFProps {
  playerName?: string;
  parsedBattleLogs: BattleLog[];
  parsedPetUsage: PetData[];
}

export interface BattleStatistics {
  totalPetSwaps: {
    player: number;
    opponent: number;
  };
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

export interface ActivePets {
  player: string | null;
  opponent: string | null;
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
