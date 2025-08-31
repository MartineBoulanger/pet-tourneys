import { IMAGE_FRAGMENT } from './asset';

export const SEO_METADATA_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  title
  description
  indexable
  keywords
  seoImage {
    ${IMAGE_FRAGMENT}
  }
`;
