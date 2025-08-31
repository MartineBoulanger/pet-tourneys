import { BANNER_FRAGMENT } from './banner';

export const ALL_PAGES_FRAGMENT = `
  __typename
  _id
  sys {
    id
  }
  pageType
  urlSlug
  pageTitle
  banner {
    ${BANNER_FRAGMENT}
  }
`;
