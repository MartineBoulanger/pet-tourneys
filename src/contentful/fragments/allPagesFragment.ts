export const ALL_PAGES_FRAGMENT = `
  sys {
    id
  }
  __typename
  pageType
  urlSlug
  pageTitle
  banner {
    bannerImage {
      media {
        title
        description
        url
      }
    }
  }
`;
