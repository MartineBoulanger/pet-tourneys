/** Globally defined types/interfaces
 * @type {Maybe} - when something can also be null
 * @type {PageParams} - when a page has params
 * @type {PageSearchParams} - when a page has search params
 * @type {MatchPageParams} - match page params
 * @type {MatchSearchParams} - when a match page has search params
 */
export type Maybe<T> = T | null;
export type PageParams = Promise<{ id: string }>;
export type PageSearchParams = Promise<{ page?: string }>;
export type MatchPageParams = Promise<{ id: string; matchId: string }>;
export type MatchSearchParams = Promise<{ matchId?: string }>;
