export const PAGE_FRAGMENT = `
  sys {
    id
    spaceId
    environmentId
    publishedAt
  }
  seoMetadata {
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
  urlSlug
  banner {
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
    text {
      json
    }
    textAligned
  }
  ctAsCollection {
    items {
      ctaText
      ctaUrl
    }
  }
  pageContentCollection {
    items {
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
            ... on Cta {
              ctaText
              ctaUrl
            }
          }
        }
      }
    }
  }
`;
