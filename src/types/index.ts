import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLProps,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { IconType } from 'react-icons';

export type TournamentTableName =
  | 'matches'
  | 'battle_logs'
  | 'pet_usage'
  | 'tournament_pet_stats';

export type PageParams = Promise<{ id: string }>;
export type MatchPageParams = Promise<{ id: string; matchId: string }>;
export type MatchSearchParams = Promise<{ matchId?: string }>;

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
  };
  total_played: number;
}
export interface PetUsage extends PetData {
  id: string;
  match_id: string;
}
export interface BreedStats {
  breed: string;
  stats: string;
  times_played: number;
}
export interface TournamentPetStat extends PetData {
  id: string;
  breed_stats: BreedStats[];
  match_count: number;
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

export interface FormErrorMessageProps {
  message?: string | undefined | null;
}

export interface ChartProps {
  data: { name: string; value: number }[] | undefined;
  children: ReactNode;
}

export interface PopupProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationData {
  id: number;
  url: string;
  linkText: string;
  text: string;
  imageSrc: string;
}

export interface FooterData {
  id: number;
  url: string;
  Icon: IconType;
  name: string;
}
