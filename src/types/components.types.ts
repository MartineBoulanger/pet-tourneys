import {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  DetailedHTMLProps,
  HTMLProps,
  InputHTMLAttributes,
  JSX,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { CloudinaryImage } from './cloudinary.types';
import {
  Announcement,
  HallOfFame,
  League,
  Match,
  Page,
  Partner,
  Pet,
  PetFilters,
  Prize,
  Resource,
  Rule,
  Schedule,
  Signup,
  Comment,
  ChartDataItem,
  LeaguePetStat,
  ChartsProps,
  BattleStatistics,
  EnhancedPlayerRecord,
  UniqueStats,
} from './supabase.types';

// =================================================
// Option.tsx -- ui component
// =================================================
export type OptionProps = {
  value: string;
  label: string;
};

// =================================================
// Button.tsx -- ui component
// =================================================
export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'primary' | 'secondary' | 'link' | 'inverted';
};

// =================================================
// Checkbox.tsx -- ui component
// =================================================
export type CheckboxProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'required'
> & {
  label?: string;
  id: string;
  name: string;
  required?: boolean;
};

// =================================================
// Form.tsx -- ui component
// =================================================
export type FormProps = HTMLProps<HTMLFormElement> & {
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
  btnClassName?: string;
};

// =================================================
// Heading.tsx -- ui component
// =================================================
type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingProps = HTMLProps<HTMLHeadingElement> & {
  as?: HeadingTags;
  children: ReactNode;
};

// =================================================
// Input.tsx -- ui component
// =================================================
export type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'required' | 'type'
> & {
  label?: string;
  id: string;
  name: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'search'
    | 'number'
    | 'date'
    | 'datetime-local'
    | 'url';
  required?: boolean;
};

// =================================================
// Select.tsx -- ui component
// =================================================
export type SelectProps = Omit<
  DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  'required'
> & {
  label: string;
  id: string;
  name: string;
  required?: boolean;
};

// =================================================
// TextArea.tsx -- ui component
// =================================================
export type TextareaProps = Omit<
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  'required' | 'rows'
> & {
  label: string;
  id: string;
  name: string;
  rows: number;
  required?: boolean;
};

// =================================================
// AbilitiesCard.tsx -- layout component
// =================================================
export type AbilitiesCardProps = {
  category: string;
  abilities: string[];
};

// =================================================
// AutoCarousel.tsx -- layout component
// =================================================
export type AutoCarouselProps = {
  children: ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
};

// =================================================
// Banner.tsx -- layout component
// =================================================
export type BannerProps = {
  bannerimage?: CloudinaryImage | null;
  className?: string;
};

// =================================================
// Carousel.tsx -- layout component
// =================================================
export type CarouselProps = {
  images: CloudinaryImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  className?: string;
  aspectRatio?: string;
  pauseOnHover?: boolean;
};

// =================================================
// DownloadImageButton.tsx -- layout component
// =================================================
export type DownloadImageButtonProps = HTMLProps<HTMLElement> & {
  publicId: string;
};

// =================================================
// ImageCard.tsx -- layout component
// =================================================
export type ImageCardProps = {
  image?: CloudinaryImage | null;
  isDownloadable?: boolean;
};

// =================================================
// ImageGrid.tsx -- layout component
// =================================================
export type ImageGridProps = {
  images?: CloudinaryImage[] | null;
  cols?: number;
  isDownloadable?: boolean;
};

// =================================================
// ImageModal.tsx -- layout component
// =================================================
export type ImageModalProps = {
  image: CloudinaryImage;
  setIsOpen: (bool: boolean) => void;
  isDownloadable: boolean;
};

// =================================================
// Modal.tsx -- layout component
// =================================================
export type ModalProps = {
  children: ReactNode;
  className?: string;
  onClose: () => void;
  show: boolean;
};

// =================================================
// OverviewCard.tsx -- layout component
// =================================================
export type OverviewCardProps = {
  title: string;
  value: number | string;
};

// =================================================
// Pagination.tsx -- layout component
// =================================================
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParam?: string;
  className?: string;
  onPageChange?: (page: number) => void;
};

// =================================================
// DeletePopup.tsx -- layout component
// =================================================
export type DeletePopupProps = {
  text?: string;
  btnText?: ReactNode | JSX.Element | string | number;
  children: ReactNode;
  className?: string;
  isDeleting?: boolean;
  onDelete?: () => void;
  variant?: 'primary' | 'secondary' | 'link' | 'inverted';
};

// =================================================
// RichTextEditor.tsx -- layout component
// =================================================
export type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  isComment?: boolean;
};

// =================================================
// Tab.tsx -- layout component
// =================================================
export type TabProps = ComponentPropsWithoutRef<'button'> & {
  active?: boolean;
};

// =================================================
// Tabs.tsx -- layout component
// =================================================
export type TabsProps = ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'pills';
};

// =================================================
// Video.tsx -- layout component
// =================================================
export type VideoProps = HTMLProps<HTMLElement> & {
  url: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  mute?: boolean;
  showinfo?: boolean;
  modestbranding?: boolean;
  disablekb?: boolean;
};

// =================================================
// Announcement.tsx -- admin panel component
// =================================================
export type AnnouncementFormProps = {
  announcement?: Announcement | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// PartnerForm.tsx -- admin panel component
// =================================================
export type PartnerFormProps = {
  partner?: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
};

// =================================================
// ResourceForm.tsx -- admin panel component
// =================================================
export type ResourceFormProps = {
  resource?: Resource;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// ScheduleForm.tsx -- admin panel component
// =================================================
export type ScheduleFormProps = {
  schedule?: Schedule | null;
  onSuccess: () => void;
  onCancel: () => void;
};

// =================================================
// SignupForm.tsx -- admin panel component
// =================================================
export type SignupFormProps = {
  signup?: Signup | null;
  onSuccess: () => void;
  onCancel: () => void;
};

// =================================================
// DeleteLeague.tsx -- admin panel component
// ExportButton.tsx
// =================================================
export type DeleteLeagueProps = {
  id: string;
  name: string;
};

// =================================================
// MatchActions.tsx -- admin panel component
// =================================================
export type DeleteMatchProps = {
  leagueId: string;
  matchId: string;
  player1: string;
  player2: string;
};

// =================================================
// HalloffameForm.tsx -- admin panel component
// =================================================
export type HalloffameFormProps = {
  hofItem?: HallOfFame;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// LeagueForm.tsx -- admin panel component
// =================================================
export type LeagueFormProps = {
  initialData?: League | null;
};

// =================================================
// LeagueItem.tsx -- admin panel component
// =================================================
export type LeagueItemProps = {
  league: League;
};

// =================================================
// MatchItem.tsx -- admin panel component
// =================================================
export type MatchItemProps = {
  match: Match;
  league: League | null;
};

// =================================================
// PrizeForm.tsx -- admin panel component
// =================================================
export type PrizeFormProps = {
  prize?: Prize;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// RuleForm.tsx -- admin panel component
// =================================================
export type RuleFormProps = {
  rule?: Rule;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// PageForm.tsx -- admin panel component
// =================================================
export type PageFormProps = {
  page?: Page;
  type: Page['type'];
  onSuccess: () => void;
  onCancel: () => void;
};

// =================================================
// PetEditForm.tsx -- admin panel component
// =================================================
export type PetEditFormProps = {
  pet: Pet;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// =================================================
// AdminPagination.tsx -- admin panel component
// =================================================
export type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
};

// =================================================
// PetEditModal.tsx -- admin panel component
// =================================================
export type PetEditModalProps = {
  pet: Pet;
  onClose: () => void;
  onSuccess: () => void;
};

// =================================================
// AdminLink.tsx -- admin panel component
// =================================================
export type AdminLinkProps = {
  onClose: () => void;
  url: string;
  linkText: string;
  imageSrc?: string;
};

// =================================================
// AdminSidebar.tsx -- admin panel component
// =================================================
export type AdminSidebarProps = {
  isAuthor?: boolean;
  isAdmin?: boolean;
};

// =================================================
// CommentForm.tsx -- cms component
// =================================================
export type CommentFormProps = {
  pageid: string;
  username?: string;
  isLoggedIn?: boolean;
  path: string;
  userId?: string | null;
};

// =================================================
// CommentList.tsx -- cms component
// =================================================
export type CommentListProps = {
  comments: Comment[];
  username?: string;
  isAdmin?: boolean;
  path: string;
};

// =================================================
// CommentsSection.tsx -- cms component
// =================================================
export type CommentsSectionProps = {
  pageid: string;
  path: string;
  username?: string | null;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  userId?: string | null;
};

// =================================================
// PartnersGallery.tsx -- cms component
// =================================================
export type PartnersGalleryProps = {
  data: Partner[];
  className?: string;
};

// =================================================
// RecentPagesSection.tsx -- cms component
// =================================================
export type RecentPagesSectionProps = {
  result: {
    type: Page['type'];
    data: Page[] | undefined;
  }[];
  guides: Page[];
};

// =================================================
// BattleCharts.tsx -- leagues component
// =================================================
export type BattleChartsProps = {
  matchesStats?: {
    averageDuration?: string;
    totalBattles?: number;
    totalMatches?: number;
    matchesByRegion?: Array<ChartDataItem>;
    battleResults?: Array<ChartDataItem>;
    matchResults?: Array<ChartDataItem>;
  };
  isMatchView: boolean;
};

// =================================================
// PetCharts.tsx -- leagues component
// =================================================
type PetUsageChartData = ChartDataItem & {
  stats: string[];
  type: string;
  breeds: string[];
  total_played: number;
};

type ChartData = {
  petUsageData: Array<PetUsageChartData>;
  petTypeData: Array<ChartDataItem>;
  petBreedData: Array<ChartDataItem>;
};

export type PetChartsProps = ChartsProps<LeaguePetStat> & {
  chartData: ChartData;
};

// =================================================
// PetControls.tsx -- leagues component
// =================================================
export type PetControlsProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: string;
  onSortChange: (option: string) => void;
  filters: {
    type: string;
    expansion: string;
    breed: string;
    source: string;
    tradable: boolean;
    capturable: boolean;
    isAllianceOnly: boolean;
    isHordeOnly: boolean;
  };
  onFilterChange: (key: string, value: string | boolean) => void;
  onResetFilters: () => void;
  uniqueStats: {
    types: string[];
    expansions: string[];
    breeds: string[];
    sources: string[];
  };
  isMatchView?: boolean;
};

export type SortOption = {
  value: string;
  label: string;
};

// =================================================
// PetPerformanceChart.tsx -- leagues component
// =================================================
export type PetPerformanceChartProps = {
  battleStats: BattleStatistics;
  isMatchView?: boolean;
};

// =================================================
// LeaguesList.tsx -- leagues component
// =================================================
export type LeaguesListProps = {
  leagues: League[];
  currentPage?: number;
  totalPages?: number;
};

// =================================================
// MatchList.tsx -- leagues component
// =================================================
export type MatchListProps = {
  matches: Match[];
  id: string;
  currentPage?: number;
  totalPages?: number;
};

// =================================================
// PlayerRankings.tsx -- leagues component
// =================================================
export type PlayerRankingsProps = {
  records: EnhancedPlayerRecord[];
  regions: string[];
  id: string;
};

// =================================================
// DesktopSidebarNavigation.tsx -- navigation component
// =================================================
export type NavigationItem = {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
};

export type DesktopSidebarNavigationProps = {
  headingSelector?: string;
  containerSelector?: string;
  className?: string;
  scrollOffset?: number;
};

// =================================================
// Menu.tsx -- navigation component
// =================================================
export type MenuProps = {
  className?: string;
  buttonVariant?: 'link' | 'primary' | 'secondary' | undefined;
};

// =================================================
// MobileSidebarNavigation.tsx -- navigation component
// =================================================
export type MobileSidebarNavigationProps = {
  headingSelector?: string;
  containerSelector?: string;
  scrollOffset?: number;
};

// =================================================
// PetFilters.tsx -- pets component
// =================================================
export type PetFiltersProps = {
  filters: PetFilters;
  uniqueStats: UniqueStats;
  onFilterChange: (key: string, value: string | boolean) => void;
};

export type SelectFilterProps = {
  label: string;
  filterKey: string;
  value: string;
  options: string[];
  onChange: (key: string, value: string) => void;
};

export type CheckboxFilterProps = {
  label: string;
  filterKey: string;
  checked: boolean;
  onChange: (key: string, value: boolean) => void;
};
