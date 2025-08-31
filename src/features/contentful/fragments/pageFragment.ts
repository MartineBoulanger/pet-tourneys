import { BANNER_FRAGMENT } from './banner';
import { CONTENT_LAYOUT_FRAGMENT } from './contentLayout';
import { CTA_FRAGMENT } from './cta';
import { RICHTEXT_FRAGMENT } from './richText';
import { SEO_METADATA_FRAGMENT } from './seoMetadata';
import { YT_VIDEO_FRAGMENT } from './youTubeVideo';

export const PAGE_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  seoMetadata {
    ${SEO_METADATA_FRAGMENT}
  }
  pageType
  urlSlug
  banner {
    ${BANNER_FRAGMENT}
  }
  pageTitle
  pageDescription {
    ${RICHTEXT_FRAGMENT}
  }
  ctAsCollection {
    items {
      ${CTA_FRAGMENT}
    }
  }
  pageContentCollection {
    items {
      __typename
      ... on ContentLayout {
        ${CONTENT_LAYOUT_FRAGMENT}
      }
      ... on ContentTypeRichText {
        ${RICHTEXT_FRAGMENT}
      }
      ... on YouTubeVideo {
        ${YT_VIDEO_FRAGMENT}
      }
    }
  }
`;
