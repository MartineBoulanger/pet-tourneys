import { Document } from '@contentful/rich-text-types';
import { Maybe } from '@/types';

// general interfaces
interface Media {
  title: string;
  description: string;
  url: string;
}

// Contentful content type interfaces
export interface ContentTypeCta {
  __typename: 'Cta';
  ctaText: string;
  ctaUrl?: string | null;
}

export interface ContentTypeAsset {
  __typename: 'ContentTypeAsset';
  media: Media;
  cta?: Maybe<ContentTypeCta>;
}

export interface ContentTypeRichText {
  __typename: 'ContentTypeRichText';
  text?: {
    json: Document;
  };
  textAligned?: string;
}

export interface ContentTypeBanner {
  __typename: 'Banner';
  bannerImage?: ContentTypeAsset;
  bannerText?: ContentTypeRichText;
  bannerActionsCollection?: {
    items?: ContentTypeCta[];
  };
}

export type PageContentItem = ContentTypeBanner | ContentTypeContentLayout;
export type ContentLayoutItem = ContentTypeAsset | ContentTypeRichText;

export interface ContentTypeContentLayout {
  __typename: 'ContentLayout';
  layout?: string;
  contentCollection: {
    items: Maybe<ContentLayoutItem>[];
  };
}

export interface ContentTypeSeoMetadata {
  __typename: 'SeoMetadata';
  title?: string | null;
  description?: string | null;
  indexable?: boolean;
  keywords?: string[] | null;
  image?: {
    media?: Media;
  };
}

export interface ContentTypePage {
  sys: {
    id: string;
  };
  __typename: 'Page';
  pageType: string;
  urlSlug?: string | null;
  pageTitle?: string | null;
  pageDescription?: Maybe<ContentTypeRichText>;
  ctAsCollection?: {
    items: Maybe<ContentTypeCta>[];
  };
  seoMetadata?: Maybe<ContentTypeSeoMetadata> | null;
  banner?: Maybe<ContentTypeBanner>;
  pageContentCollection?: {
    items: Maybe<PageContentItem>[];
  };
}

// Contentful query fragment interfaces
export interface AllPagesFragment {
  sys: {
    id: string;
  };
  __typename: 'Page';
  pageType: string;
  urlSlug?: string | null;
  pageTitle?: string | null;
  banner?: {
    bannerImage?: {
      media: Media;
    };
  };
}

// Contentful components interfaces
export interface AssetProps {
  component: ContentTypeAsset;
  isBanner?: boolean;
  isPage?: boolean;
  className?: string;
}

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
}
