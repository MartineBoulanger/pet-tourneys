'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import dbConnect from '../client';
import { Rule as RuleType, MongoRuleDocument } from '../types';
import { Rule } from '../models/Rule';
import { getImagesByIds } from './resources';

export async function createRule(data: Partial<RuleType>) {
  try {
    await dbConnect();

    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const validImageIds =
      data.imageIds?.filter(
        (id) =>
          id && id.trim() !== '' && mongoose.Types.ObjectId.isValid(id.trim())
      ) || [];

    const lastRule = await Rule.findOne().sort({ order: -1 });
    const nextOrder = (lastRule?.order || 0) + 1;

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      imageIds: validImageIds,
      order: nextOrder,
    };

    const newRule = new Rule(ruleData);
    const savedRule = await newRule.save();

    const result: RuleType = {
      _id: String(savedRule._id),
      title: savedRule.title,
      content: savedRule.content,
      imageIds: savedRule.imageIds,
      order: savedRule.order,
      createdAt: savedRule.createdAt,
      updatedAt: savedRule.updatedAt,
    };

    revalidatePath('/admin/rules');

    return { success: true, rule: result };
  } catch (error) {
    console.error('Failed to create rule:', error);
    return { success: false, error: 'Failed to create rule' };
  }
}

export async function updateRule(ruleId: string, data: Partial<RuleType>) {
  try {
    await dbConnect();

    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const cleanImageIds = data.imageIds
      ?.filter((id) => id && typeof id === 'string' && id.trim() !== '')
      .map((id) => id.trim());

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      imageIds: cleanImageIds,
      updatedAt: data.updatedAt,
    };

    const updatedRule = await Rule.findByIdAndUpdate(ruleId, ruleData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRule) return { success: false, error: 'Rule not found' };

    const result: RuleType = {
      _id: String(updatedRule._id),
      title: updatedRule.title,
      content: updatedRule.content,
      imageIds: updatedRule.imageIds,
      order: updatedRule.order,
      createdAt: updatedRule.createdAt,
      updatedAt: updatedRule.updatedAt,
    };

    revalidatePath('/admin/rules');

    return { success: true, rule: result };
  } catch (error) {
    console.error('Failed to update rule:', error);
    return { success: false, error: 'Failed to update rule' };
  }
}

export async function deleteRule(ruleId: string) {
  try {
    await dbConnect();

    const deleteRule = await Rule.findByIdAndDelete(ruleId);

    if (!deleteRule) return { success: false, error: 'Rule not found' };

    revalidatePath('/admin/rules');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete rule:', error);
    return { success: false, error: 'Failed to delete rule' };
  }
}

export async function getRules(): Promise<RuleType[]> {
  try {
    await dbConnect();

    const rules = await Rule.find().sort({ order: 1 }).lean();

    return rules.map((rule) => ({
      _id: String(rule._id),
      title: rule.title,
      content: rule.content,
      imageIds: rule.imageIds.map((id: string) => id.toString()),
      order: rule.order,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    }));
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    return [];
  }
}

export async function getRule(ruleId: string): Promise<RuleType | null> {
  try {
    await dbConnect();

    const rule = await Rule.findById(ruleId).lean();

    if (!rule) return null;

    return {
      _id: (rule as MongoRuleDocument)._id.toString(),
      title: (rule as MongoRuleDocument).title,
      content: (rule as MongoRuleDocument).content,
      imageIds: (rule as MongoRuleDocument).imageIds?.map((id: string) =>
        id.toString()
      ),
      order: (rule as MongoRuleDocument).order,
      createdAt: (rule as MongoRuleDocument).createdAt,
      updatedAt: (rule as MongoRuleDocument).updatedAt,
    };
  } catch (error) {
    console.error('Failed to fetch rule:', error);
    return null;
  }
}

export async function getRulesWithImages() {
  try {
    const rules = await getRules();

    const rulesWithImages = await Promise.all(
      rules.map(async (rule) => {
        const ids = rule.imageIds?.length ? rule.imageIds : [];
        const images = await getImagesByIds(ids);
        return {
          ...rule,
          images,
        };
      })
    );

    return rulesWithImages;
  } catch (error) {
    console.error('Error fetching rules with images:', error);
    return [];
  }
}

export async function updateRuleOrder(ruleId: string, newOrder: number) {
  try {
    await dbConnect();

    await Rule.findByIdAndUpdate(ruleId, { order: newOrder });

    revalidatePath('/admin/rules');

    return { success: true };
  } catch (error) {
    console.error('Failed to update rule order:', error);
    return { success: false, error: 'Failed to update the order of the rules' };
  }
}

export async function reorderRules(ruleIds: string[]) {
  try {
    await dbConnect();

    const updatePromises = ruleIds.map((id, index) =>
      Rule.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    revalidatePath('/admin/rules');

    return { success: true };
  } catch (error) {
    console.error('Failed to reorder rules:', error);
    return { success: false, error: 'Failed to reorder the rules' };
  }
}
