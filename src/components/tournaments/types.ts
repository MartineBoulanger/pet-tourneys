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

export interface Tournament {
  id: string;
  name: string;
  start_date: string;
  end_date?: string | null;
  participant_count: number;
}

export interface TournamentsListProps {
  tournaments: Tournament[];
}
