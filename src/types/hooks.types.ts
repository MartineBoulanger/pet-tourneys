import { Pet, BattleStatistics, LeaguePetStat } from './supabase.types';

// =================================================
// CMS form type
// =================================================
export type UseCMSFormOptions<T> = {
  initialData: T;
  emptyData: T;
  createFn: (data: T) => Promise<{ success: boolean; error?: string }>;
  updateFn: (
    id: string,
    data: T,
  ) => Promise<{ success: boolean; error?: string }>;
  existingId?: string;
  validate?: (data: T) => string | null;
  onSuccess?: () => void;
};

// =================================================
// CMS manager types
// =================================================
type VisibilityActions<T> = {
  show: (id: string) => Promise<{ success: boolean; error?: string }>;
  hide: (id: string) => Promise<{ success: boolean; error?: string }>;
};

export type UseManagerOptions<T extends { id: string; invisible?: boolean }> = {
  fetchFn: () => Promise<{ success: boolean; data?: T[]; error?: string }>;
  deleteFn: (id: string) => Promise<{ success: boolean; error?: string }>;
  reorderFn?: (ids: string[]) => Promise<{ success: boolean; error?: string }>;
  deleteConfirmMessage?: string;
  visibilityActions?: VisibilityActions<T>;
  exclusiveVisibility?: boolean;
};

// =================================================
// Pets filter type
// =================================================
export type UsePetsFiltersProps = {
  petData: Pet[];
  petStats?: LeaguePetStat[];
  battleStats?: BattleStatistics;
  isMatchView?: boolean;
};

// =================================================
// User type
// =================================================
export type User = {
  id: string;
  role: string;
  avatar_url: string;
  username: string;
} | null;
