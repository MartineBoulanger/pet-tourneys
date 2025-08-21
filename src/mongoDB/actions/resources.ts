'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '../client';
import {
  Resource as ResourceType,
  ImageUpload,
  MongoResourceDocument,
} from '../types';
import { Resource } from '../models/Resource';
import { Upload } from '../models/Upload';

export async function createResource(formData: FormData) {
  try {
    await dbConnect();

    const title = formData.get('title') as string;
    const imageIds = formData.getAll('imageIds') as string[];

    if (!title?.trim()) return { success: false, error: 'Title is required' };

    const validImageIds = imageIds.filter(
      (id) =>
        id && id.trim() !== '' && mongoose.Types.ObjectId.isValid(id.trim())
    );

    const lastResource = await Resource.findOne().sort({ order: -1 });
    const nextOrder = (lastResource?.order || 0) + 1;

    const resourceData = {
      title: title.trim(),
      imageIds: validImageIds,
      order: nextOrder,
    };

    const newResource = new Resource(resourceData);
    const savedResource = await newResource.save();

    const result: ResourceType = {
      _id: String(savedResource._id),
      title: savedResource.title,
      imageIds: savedResource.imageIds,
      order: savedResource.order,
      createdAt: savedResource.createdAt,
      updatedAt: savedResource.updatedAt,
    };

    revalidatePath('/admin/resources');

    return {
      success: true,
      resource: result,
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return { success: false, error: 'Error creating resource' };
  }
}

export async function updateResource(resourceId: string, formData: FormData) {
  try {
    await dbConnect();

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

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      resourceData,
      { new: true, runValidators: true }
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
    return { success: false, error: 'Failed to edit resource' };
  }
}

export async function deleteResource(resourceId: string) {
  try {
    await dbConnect();

    const deleteResource = await Resource.findByIdAndDelete(resourceId);

    if (!deleteResource) return { success: false, error: 'Resource not found' };

    revalidatePath('/admin/resources');

    return { success: true };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return {
      success: false,
      error: 'Failed to delete resource',
    };
  }
}

export async function getResources(): Promise<ResourceType[]> {
  try {
    await dbConnect();

    const resources = await Resource.find().sort({ order: 1 }).lean();

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
    await dbConnect();

    const resource = await Resource.findById(resourceId).lean();

    if (!resource) return null;

    return {
      _id: (resource as MongoResourceDocument)._id.toString(),
      title: (resource as MongoResourceDocument).title,
      imageIds: (resource as MongoResourceDocument).imageIds.map((id: string) =>
        id.toString()
      ),
      order: (resource as MongoResourceDocument).order,
      createdAt: (resource as MongoResourceDocument).createdAt,
      updatedAt: (resource as MongoResourceDocument).updatedAt,
    };
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

export async function getImagesByIds(
  imageIds: string[]
): Promise<ImageUpload[]> {
  try {
    await dbConnect();

    const validObjectIds = imageIds
      .filter((id) => id && typeof id === 'string' && id.trim() !== '')
      .map((id) => {
        try {
          if (mongoose.isValidObjectId(id)) {
            return new mongoose.Types.ObjectId(id);
          }
          return null;
        } catch (error) {
          console.warn('Invalid ObjectId:', id, error);
          return null;
        }
      })
      .filter((id): id is mongoose.Types.ObjectId => id !== null);

    if (validObjectIds.length === 0) {
      return [];
    }

    const images = await Upload.find({ _id: { $in: validObjectIds } }).lean();

    return images.map((image) => ({
      _id: String(image._id),
      src: image.src ?? '',
      alt: image.alt ?? '',
      width: image.width ?? 0,
      height: image.height ?? 0,
      usedIn: Array.isArray(image.usedIn)
        ? image.usedIn.map((id: any) => String(id))
        : [],
      usedInModel: image.usedInModel ?? undefined,
      createdAt: image.createdAt ?? null,
      updatedAt: image.updatedAt ?? null,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
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
    await dbConnect();

    await Resource.findByIdAndUpdate(resourceId, { order: newOrder });

    revalidatePath('/admin/resources');

    return { success: true };
  } catch (error) {
    console.error('Error updating resource order:', error);
    return {
      success: false,
      error: 'Failed to update the order of the resources',
    };
  }
}

export async function reorderResources(resourceIds: string[]) {
  try {
    await dbConnect();

    const updatePromises = resourceIds.map((id, index) =>
      Resource.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    revalidatePath('/admin/resources');

    return { success: true };
  } catch (error) {
    console.error('Failed to reorder resources:', error);
    return { success: false, error: 'Failed to reorder the resources' };
  }
}
