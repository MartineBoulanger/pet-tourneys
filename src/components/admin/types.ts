import { Match, Tournament } from '@/components/tournaments/types';

export interface AdminMatchListItemProps {
  match: Match;
  tournament: Tournament;
}

export interface AdminPanelButtonsProps {
  isMatchesPage?: boolean;
}

export interface DeleteTournamentProps {
  id: string;
  name: string;
}

export interface DeleteMatchProps {
  tournamentId: string;
  matchId: string;
  player1: string;
  player2: string;
}

export interface TournamentFormProps {
  initialData?: Tournament | null;
}

export interface TournamentsListItemProps {
  tournament: Tournament;
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
