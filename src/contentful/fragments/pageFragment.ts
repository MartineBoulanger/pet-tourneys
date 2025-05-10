export const PAGE_FRAGMENT = `
  sys {
    id
  }
  __typename
  seoMetadata {
    __typename
    title
    description
    indexable
    keywords
    image {
      media {
        title
        description
        url
      }
    }
  }
  pageType
  urlSlug
  banner {
    __typename
    bannerImage {
      media {
        title
        description
        url
      }
    }
    bannerText {
      text {
        json
      }
      textAligned
    }
    bannerActionsCollection {
      items {
        ctaText
        ctaUrl
      }
    }
  }
  pageTitle
  pageDescription {
    __typename
    text {
      json
    }
    textAligned
  }
  ctAsCollection {
    items {
      __typename
      ctaText
      ctaUrl
    }
  }
  pageContentCollection {
    items {
      __typename
      ... on Banner {
        bannerImage {
          media {
            title
            description
            url
          }
        }
        bannerText {
          text {
            json
          }
          textAligned
        }
        bannerActionsCollection {
          items {
            ctaText
            ctaUrl
          }
        }
      }
      ... on ContentLayout {
        layout
        contentCollection {
          items {
            __typename
            ... on ContentTypeAsset {
              media {
                title
                description
                url
              }
              cta {
                ctaText
                ctaUrl
              }
            }
            ... on ContentTypeRichText {
              text {
                json
              }
              textAligned
            }
          }
        }
      }
    }
  }
`;
