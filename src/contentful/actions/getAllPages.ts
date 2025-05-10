'use server';

import { contentful } from '../client';
import { ALL_PAGES_FRAGMENT } from '../fragments/allPagesFragment';

export const getAllPages = async (isPreview = false, pageType = '') => {
  const pages = await contentful(
    `query getAllPages {
        pageCollection(limit: 12, preview: ${
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
