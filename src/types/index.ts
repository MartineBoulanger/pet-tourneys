/** Globally defined types
 * @type {Maybe} - when something can also be null
 * @type {Action} - to create or drop a table
 * @type {TournamentTableName} - to set the key for the correct table
 * @type {PageParams} - when a page has params
 * @type {PageSearchParams} - when a page has search params
 * @type {MatchPageParams} - match page params
 * @type {MatchSearchParams} - when a match page has search params
 */
export type Maybe<T> = T | null;
export type Action = 'create' | 'drop';
export type TournamentTableName =
  | 'matches'
  | 'battle_logs'
  | 'pet_usage'
  | 'tournament_pet_stats';
export type PageParams = Promise<{ id: string }>;
export type PageSearchParams = Promise<{ page?: string }>;
export type MatchPageParams = Promise<{ id: string; matchId: string }>;
export type MatchSearchParams = Promise<{ matchId?: string }>;

/**
 * Globally defined interface
 * @interface Profile - interface for the Supabase table "profiles"
 */
export interface Profile {
  id: string;
  email: string;
  username: string;
  discord_id: string | null;
  avatar_url: string | null;
  role: string;
}
