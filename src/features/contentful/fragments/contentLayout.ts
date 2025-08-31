import { RICHTEXT_FRAGMENT } from './richText';
import { BANNER_FRAGMENT } from './banner';
import { YT_VIDEO_FRAGMENT } from './youTubeVideo';

export const CONTENT_LAYOUT_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  layout
  contentCollection {
    items {
      __typename
      ... on Banner {
        ${BANNER_FRAGMENT}
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
