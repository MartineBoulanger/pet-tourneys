import { CTA_FRAGMENT } from './cta';
import { RICHTEXT_FRAGMENT } from './richText';
import { IMAGE_FRAGMENT } from './asset';

export const HOMEPAGE_BANNER_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  title
  image {
    ${IMAGE_FRAGMENT}
  }
  description {
    ${RICHTEXT_FRAGMENT}
  }
  buttonsCollection {
    items {
      ${CTA_FRAGMENT}
    }
  }
`;
