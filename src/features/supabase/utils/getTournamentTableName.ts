import { TournamentTableName } from '../types';

export const getTournamentTableName = (
  tableType: TournamentTableName,
  tournamentId: string
) => {
  const suffix = tournamentId.replace(/-/g, '');
  return `${tableType}_${suffix}`;
};
