'use server';

import { contentful } from '../client';
import { ALL_PAGES_FRAGMENT } from '../fragments/allPagesFragment';

export const getLatestPages = async (isPreview = false, pageType = '') => {
  const pages = await contentful(
    `query getLatestPages {
        pageCollection(limit: 4, preview: ${
          isPreview ? 'true' : 'false'
        }, where: {urlSlug_exists: true, pageType: "${pageType}"}) {
          items {
            ${ALL_PAGES_FRAGMENT}
          }
        }
      }`,
    isPreview
  );

  return pages?.data?.pageCollection?.items;
};
