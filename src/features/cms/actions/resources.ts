'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getImagesByIds } from '@/features/image-server/actions/getImages';
import { getCollection } from '../client';
import { Resource as ResourceType } from '../types';

export async function createResource(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const imageIds = formData.getAll('imageIds') as string[];

    if (!title?.trim()) return { success: false, error: 'Title is required' };

    const db = await getCollection('resources');
    const lastResource = await db
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const nextOrder = lastResource.length > 0 ? lastResource[0].order + 1 : 1;

    const validImageIds = imageIds.filter(
      (id) => id && id.trim() !== '' && ObjectId.isValid(id.trim())
    );

    const resourceData = {
      title: title.trim(),
      imageIds: validImageIds,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(resourceData);

    revalidatePath('/admin/resources');

    return {
      success: true,
      resource: {
        _id: String(result.insertedId),
        ...resourceData,
        imageIds: validImageIds.map((id) => id.toString()),
      },
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return { success: false, error: `Error creating resource: ${error}` };
  }
}

export async function updateResource(resourceId: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    let imageIds: string[] = [];
    const imageIdsFromGetAll = formData.getAll('imageIds') as string[];

    if (imageIdsFromGetAll && imageIdsFromGetAll.length > 0) {
      imageIds = imageIdsFromGetAll;
    } else {
      const imageIdsString = formData.get('imageIds') as string;
      if (imageIdsString) {
        try {
          const parsed = JSON.parse(imageIdsString);
          if (Array.isArray(parsed)) {
            imageIds = parsed;
          }
        } catch (parseError) {
          console.error(
            'Failed to parse imageIds as JSON, treating as single value:',
            parseError
          );
          imageIds = [imageIdsString];
        }
      }
    }

    if (!title?.trim()) return { success: false, error: 'Title is required' };

    const cleanImageIds = imageIds
      .filter((id) => id && typeof id === 'string' && id.trim() !== '')
      .map((id) => id.trim());

    const resourceData = {
      title: title.trim(),
      imageIds: cleanImageIds,
      updatedAt: new Date(),
    };

    const db = await getCollection('resources');
    const updatedResource = await db.findOneAndUpdate(
      { _id: new ObjectId(resourceId) },
      { $set: resourceData },
      { returnDocument: 'after' }
    );

    if (!updatedResource)
      return { success: false, error: 'Resource not found' };

    const result: ResourceType = {
      _id: String(updatedResource._id),
      title: updatedResource.title,
      imageIds: updatedResource.imageIds,
      order: updatedResource.order,
      createdAt: updatedResource.createdAt,
      updatedAt: updatedResource.updatedAt,
    };

    revalidatePath('/admin/resources');

    return { success: true, resource: result };
  } catch (error) {
    console.error('Error updating resource:', error);
    return { success: false, error: `Failed to edit resource: ${error}` };
  }
}

export async function deleteResource(resourceId: string) {
  try {
    const db = await getCollection('resources');
    const deleteResource = await db.findOneAndDelete({
      _id: new ObjectId(resourceId),
    });

    if (!deleteResource) return { success: false, error: 'Resource not found' };

    revalidatePath('/admin/resources');

    return { success: true };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return {
      success: false,
      error: `Failed to delete resource: ${error}`,
    };
  }
}

export async function getResources(): Promise<ResourceType[]> {
  try {
    const db = await getCollection('resources');
    const resources = await db.find({}).sort({ order: 1 }).toArray();

    return resources.map((resource) => ({
      _id: String(resource._id),
      title: resource.title,
      imageIds: resource.imageIds.map((id: string) => id.toString()),
      order: resource.order,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

export async function getResource(
  resourceId: string
): Promise<ResourceType | null> {
  try {
    const db = await getCollection('resources');
    const resource = await db.findOne({
      _id: new ObjectId(resourceId),
    });

    if (!resource) return null;

    return {
      _id: String(resource._id),
      title: resource.title,
      imageIds: resource.imageIds.map((id: string) => id.toString()),
      order: resource.order,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

export async function getResourcesWithImages() {
  try {
    const resources = await getResources();

    const resourcesWithImages = await Promise.all(
      resources.map(async (resource) => {
        const images = await getImagesByIds(resource.imageIds);
        return {
          ...resource,
          images,
        };
      })
    );

    return resourcesWithImages;
  } catch (error) {
    console.error('Error fetching resources with images:', error);
    return [];
  }
}

export async function updateResourceOrder(
  resourceId: string,
  newOrder: number
) {
  try {
    const db = await getCollection('resources');
    await db.findOneAndUpdate(
      { _id: new ObjectId(resourceId) },
      { $set: { order: newOrder } },
      { returnDocument: 'after' }
    );

    revalidatePath('/admin/resources');

    return { success: true };
  } catch (error) {
    console.error('Error updating resource order:', error);
    return {
      success: false,
      error: `Failed to update the order of the resources: ${error}`,
    };
  }
}

export async function reorderResources(resourceIds: string[]) {
  try {
    // Create bulk write operations for efficient updating
    const bulkOps = resourceIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1, updatedAt: new Date() } },
      },
    }));

    // Execute all updates in a single operation
    const db = await getCollection('resources');
    const result = await db.bulkWrite(bulkOps);

    revalidatePath('/admin/resources');
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Failed to reorder resources:', error);
    return {
      success: false,
      error: `Failed to reorder the resources: ${error}`,
    };
  }
}
