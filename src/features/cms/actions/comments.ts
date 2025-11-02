'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import { Comment } from '../types';

interface CreateCommentData {
  pageId: string;
  name?: string;
  username?: string;
  content: string;
  path: string;
}

export async function createComment(data: CreateCommentData) {
  try {
    if (!ObjectId.isValid(data.pageId)) {
      return { success: false, error: 'Invalid page ID' };
    }
    if (!data.content.trim()) {
      return { success: false, error: 'Content is required' };
    }

    const db = await getCollection('comments');

    const commentData = {
      pageId: data.pageId,
      name: data.name?.trim() || 'Anonymous',
      username: data.username?.trim() || '',
      content: data.content.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(commentData);

    revalidatePath(data.path);
    return {
      success: true,
      comment: {
        _id: String(result.insertedId),
        pageId: commentData.pageId,
        name: commentData.name,
        username: commentData.username,
        content: commentData.content,
        createdAt: new Date(commentData.createdAt),
        updatedAt: new Date(commentData.updatedAt),
      },
    };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return { success: false, error: 'Failed to add comment' };
  }
}

export async function getCommentsByPageId(pageId: string): Promise<Comment[]> {
  try {
    if (!ObjectId.isValid(pageId)) return [];
    const db = await getCollection('comments');
    const comments = await db
      .find({ pageId })
      .sort({ createdAt: -1 })
      .toArray();

    return comments.map((comment) => ({
      _id: String(comment._id),
      pageId: comment.pageId,
      name: comment.name,
      username: comment.username,
      content: comment.content,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return [];
  }
}

export async function updateComment(
  commentId: string,
  username: string,
  content: string,
  path: string
) {
  try {
    if (!ObjectId.isValid(commentId))
      return { success: false, error: 'Invalid comment ID' };

    const db = await getCollection('comments');
    const result = await db.findOneAndUpdate(
      { _id: new ObjectId(commentId), username },
      { $set: { content, updatedAt: new Date() } }
    );

    if (!result)
      return { success: false, error: 'Comment not found or not owned' };

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Failed to update comment:', error);
    return { success: false, error: 'Failed to update comment' };
  }
}

export async function deleteComment(
  commentId: string,
  path: string,
  username?: string,
  isAdmin: boolean = false
) {
  try {
    if (!ObjectId.isValid(commentId))
      return { success: false, error: 'Invalid comment ID' };

    const db = await getCollection('comments');
    const query = isAdmin
      ? { _id: new ObjectId(commentId) }
      : { _id: new ObjectId(commentId), username };

    const result = await db.findOneAndDelete(query);

    if (!result)
      return { success: false, error: 'Comment not found or not authorized' };

    revalidatePath(path);
    return { success: true };
  } catch (err) {
    console.error('Failed to delete comment:', err);
    return { success: false, error: 'Failed to delete comment' };
  }
}
