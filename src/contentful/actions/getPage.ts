'use server';

import { contentful } from '../client';
import { PAGE_FRAGMENT } from '../fragments/pageFragment';

export const getPage = async (isPreview = false, slug: string) => {
  console.log(slug);
  const page = await contentful(
    `query getPage {
      pageCollection(limit: 1, preview: ${
        isPreview ? 'true' : 'false'
      }, where: {urlSlug: "${slug}"}) {
        items {
          ${PAGE_FRAGMENT}
        }
      }
    }`,
    isPreview
  );

  return page?.data?.pageCollection?.items[0];
};
