import { IMAGE_FRAGMENT } from './asset';
import { RICHTEXT_FRAGMENT } from './richText';
import { CTA_FRAGMENT } from './cta';
import { YT_VIDEO_FRAGMENT } from './youTubeVideo';

export const BANNER_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  bannerPicture {
    ${IMAGE_FRAGMENT}
  }
  bannerVideo {
    ${YT_VIDEO_FRAGMENT}
  }
  bannerText {
    ${RICHTEXT_FRAGMENT}
  }
  bannerActionsCollection {
    items {
      ${CTA_FRAGMENT}
    }
  }
`;
