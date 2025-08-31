import { Document } from '@contentful/rich-text-types';
import { Maybe } from '@/types';

// general interfaces
export interface Media {
  url: string;
  title: string;
  height: number;
  width: number;
}

interface Items<T> {
  items?: T[];
}

type Sys = { id: string };
type Json = { json: Document };

// Contentful content type interfaces
export interface ContentTypeCta {
  __typename: 'Cta';
  _id?: string | number;
  sys: Sys;
  ctaText: string;
  ctaUrl?: string | null;
  ctaVariant?: string;
}

export interface ContentTypeRichText {
  __typename: 'ContentTypeRichText';
  _id?: string | number;
  sys: Sys;
  text?: Json;
  textAligned?: string;
}

export interface ContentTypeBanner {
  __typename: 'Banner';
  _id?: string | number;
  sys: Sys;
  bannerPicture?: Media;
  bannerVideo?: ContentTypeYouTubeVideo;
  bannerText?: ContentTypeRichText;
  bannerActionsCollection?: Items<ContentTypeCta>;
}

export interface ContentTypeYouTubeVideo {
  __typename: 'YouTubeVideo';
  _id?: string | number;
  sys: Sys;
  title?: string | null;
  youTubeUrl: string;
  description?: ContentTypeRichText;
  thumbnail?: Media;
}

export type ContentLayoutItem =
  | ContentTypeBanner
  | ContentTypeRichText
  | ContentTypeYouTubeVideo;

export interface ContentTypeContentLayout {
  __typename: 'ContentLayout';
  _id?: string | number;
  sys: Sys;
  layout?: string;
  contentCollection: Items<ContentLayoutItem>;
}

export interface ContentTypeSeoMetadata {
  __typename: 'SeoMetadata';
  _id?: string | number;
  sys: Sys;
  title?: string | null;
  description?: string | null;
  indexable?: boolean;
  keywords?: string[] | null;
  seoImage?: Media;
}

export type PageContentItem =
  | ContentTypeContentLayout
  | ContentTypeRichText
  | ContentTypeYouTubeVideo;

export interface ContentTypePage {
  __typename: 'Page';
  _id?: string | number;
  sys: Sys;
  pageType: string;
  urlSlug?: string | null;
  pageTitle?: string | null;
  pageDescription?: Maybe<ContentTypeRichText>;
  ctAsCollection?: Items<ContentTypeCta>;
  seoMetadata?: Maybe<ContentTypeSeoMetadata> | null;
  banner?: Maybe<ContentTypeBanner>;
  pageContentCollection?: Items<PageContentItem>;
}

// Contentful query fragment interfaces
export interface AllPagesFragment {
  __typename: 'Page';
  _id?: string | number;
  sys: Sys;
  pageType: string;
  urlSlug?: string | null;
  pageTitle?: string | null;
  banner?: {
    bannerPicture?: Media;
  };
}

// Contentful components interfaces
export interface BannerProps {
  component: ContentTypeBanner;
  isPage?: boolean;
  className?: string;
}

export interface ContentLayoutProps {
  component: ContentTypeContentLayout;
  className?: string;
}

export interface CtaProps {
  component: ContentTypeCta;
  className?: string;
}

export interface PageCardProps {
  page: AllPagesFragment;
}

export interface PageContentProps {
  components: Maybe<PageContentItem>[];
}

export interface RichTextProps {
  component: ContentTypeRichText;
  className?: string;
  isContentLayout?: boolean;
}

export interface YouTubeVideoProps {
  component: ContentTypeYouTubeVideo;
  className?: string;
  autoplay?: boolean;
  showinfo?: boolean;
  isContentLayout?: boolean;
}
