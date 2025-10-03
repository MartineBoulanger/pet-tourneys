'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import { Page } from '../types';
import { generatePageSlug } from '../utils';

export async function createPage(data: Partial<Page>) {
  try {
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };
    const db = await getCollection('pages');
    const slug = generatePageSlug(data.title);
    const pageData = {
      title: data.title?.trim() || undefined,
      slug,
      type: data.type || 'articles',
      bannerUrl: data.bannerUrl?.trim() || '',
      bannerImage: data.bannerImage || null,
      bannerType: data.bannerType || 'none',
      sections: data.sections ?? [],
      published: data.published ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.insertOne(pageData);
    revalidatePath('/admin/pages');
    return {
      success: true,
      page: {
        _id: String(result.insertedId),
        title: pageData.title,
        slug: pageData.slug,
        type: pageData.type,
        bannerUrl: pageData.bannerUrl,
        bannerImage: pageData.bannerImage,
        bannerType: pageData.bannerType,
        sections: pageData.sections,
        published: pageData.published,
        createdAt: new Date(pageData.createdAt),
        updatedAt: new Date(pageData.updatedAt),
      },
    };
  } catch (error) {
    console.error(`Failed to create ${data.type} page:`, error);
    return { success: false, error: `Failed to create ${data.type} page` };
  }
}

export async function updatePage(pageId: string, data: Partial<Page>) {
  try {
    if (!ObjectId.isValid(pageId))
      return { success: false, error: 'Invalid page ID' };
    if (!data.title?.trim())
      return { success: false, error: 'Title is required' };
    const db = await getCollection('pages');
    const slug = generatePageSlug(data.title);
    const updateData = {
      title: data.title?.trim() || undefined,
      slug,
      type: data.type || 'articles',
      bannerUrl: data.bannerUrl?.trim() || '',
      bannerImage: data.bannerImage || null,
      bannerType: data.bannerType || 'none',
      sections: data.sections ?? [],
      published: data.published ?? true,
      updatedAt: new Date(),
    };
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(pageId) },
      { $set: updateData }
    );
    if (!result) return { success: false, error: 'Page not found' };
    revalidatePath('/admin/pages');
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${data.type} page:`, error);
    return { success: false, error: `Failed to create ${data.type} page` };
  }
}

export async function deletePage(pageId: string) {
  try {
    if (!ObjectId.isValid(pageId))
      return { success: false, error: 'Invalid page ID' };
    const db = await getCollection('pages');
    const deletePage = await db.findOneAndDelete({ _id: new ObjectId(pageId) });
    if (!deletePage) return { success: false, error: 'Page not found' };
    revalidatePath('/admin/pages');
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete page:`, error);
    return { success: false, error: `Failed to delete page` };
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const db = await getCollection('pages');
    const pages = await db.find({}).sort({ createdAt: -1 }).toArray();
    return pages.map((page) => ({
      _id: String(page._id),
      title: page.title,
      slug: page.slug,
      type: page.type,
      bannerUrl: page.bannerUrl,
      bannerImage: page.bannerImage,
      bannerType: page.bannerType,
      sections: page.sections,
      published: page.published,
      createdAt: new Date(page.createdAt),
      updatedAt: new Date(page.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

export async function getPagesByType(type: string): Promise<Page[]> {
  try {
    const db = await getCollection('pages');
    const pages = await db
      .find({ type: type, published: true })
      .sort({ createdAt: -1 })
      .toArray();
    return pages.map((page) => ({
      _id: String(page._id),
      title: page.title,
      slug: page.slug,
      type: page.type,
      bannerUrl: page.bannerUrl,
      bannerImage: page.bannerImage,
      bannerType: page.bannerType,
      sections: page.sections,
      published: page.published,
      createdAt: new Date(page.createdAt),
      updatedAt: new Date(page.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
}

export async function getRecentPagesByTypes(types: string[]) {
  const result = await Promise.all(
    types.map(async (type) => {
      const pages = await getPagesByType(type);
      return { type, pages: pages.slice(0, 5) };
    })
  );
  return result;
}

export async function getPageBySlug(slug: string) {
  try {
    const db = await getCollection('pages');
    const page = await db.findOne<Page>({ slug });
    if (!page) return { success: false, page: null };
    return {
      success: true,
      page: {
        _id: String(page._id),
        title: page.title,
        slug: page.slug,
        type: page.type,
        bannerUrl: page.bannerUrl,
        bannerImage: page.bannerImage,
        bannerType: page.bannerType,
        sections: page.sections,
        published: page.published,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt),
      },
    };
  } catch (error) {
    console.error('Failed to get page:', error);
    return { success: false, error: 'Failed to get page' };
  }
}
