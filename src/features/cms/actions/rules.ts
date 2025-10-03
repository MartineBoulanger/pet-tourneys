'use server';

import { readFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import { getCollection } from '../client';
import { Rule as RuleType } from '../types';

export async function createRule(data: Partial<RuleType>) {
  try {
    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const db = await getCollection('rules');
    const lastRule = await db.find({}).sort({ order: -1 }).limit(1).toArray();
    const nextOrder = lastRule.length > 0 ? lastRule[0].order + 1 : 1;

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      images: data.images,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insertOne(ruleData);

    revalidatePath('/admin/rules');

    return {
      success: true,
      rule: {
        _id: String(result.insertedId),
        title: ruleData.title,
        content: ruleData.content,
        images: ruleData.images,
        order: ruleData.order,
        createdAt: new Date(ruleData.createdAt),
        updatedAt: new Date(ruleData.updatedAt),
      },
    };
  } catch (error) {
    console.error('Failed to create rule:', error);
    return { success: false, error: `Failed to create rule: ${error}` };
  }
}

export async function updateRule(ruleId: string, data: Partial<RuleType>) {
  try {
    if (!data.title?.trim() || !data.content?.trim())
      return { success: false, error: 'Title and Content are required' };

    const ruleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      images: data.images || [],
      updatedAt: data.updatedAt,
    };

    const db = await getCollection('rules');
    const updatedRule = await db.findOneAndUpdate(
      { _id: new ObjectId(ruleId) },
      { $set: ruleData },
      { returnDocument: 'after' }
    );

    if (!updatedRule) return { success: false, error: 'Rule not found' };

    const result: RuleType = {
      _id: String(updatedRule._id),
      title: updatedRule.title,
      content: updatedRule.content,
      images: updatedRule.images,
      order: updatedRule.order,
      createdAt: new Date(updatedRule.createdAt),
      updatedAt: new Date(updatedRule.updatedAt),
    };

    revalidatePath('/admin/rules');

    return { success: true, rule: result };
  } catch (error) {
    console.error('Failed to update rule:', error);
    return { success: false, error: `Failed to update rule: ${error}` };
  }
}

export async function deleteRule(ruleId: string) {
  try {
    const db = await getCollection('rules');
    const deleteRule = await db.findOneAndDelete({
      _id: new ObjectId(ruleId),
    });

    if (!deleteRule) return { success: false, error: 'Rule not found' };

    revalidatePath('/admin/rules');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete rule:', error);
    return { success: false, error: `Failed to delete rule: ${error}` };
  }
}

export async function getRules(): Promise<RuleType[]> {
  try {
    const db = await getCollection('rules');
    const rules = await db.find({}).sort({ order: 1 }).toArray();

    return rules.map((rule) => ({
      _id: String(rule._id),
      title: rule.title,
      content: rule.content,
      images: rule.images || [],
      order: rule.order,
      createdAt: new Date(rule.createdAt),
      updatedAt: new Date(rule.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    return [];
  }
}

export async function getRule(ruleId: string): Promise<RuleType | null> {
  try {
    const db = await getCollection('rules');
    const rule = await db.findOne({
      _id: new ObjectId(ruleId),
    });

    if (!rule) return null;

    return {
      _id: String(rule._id),
      title: rule.title,
      content: rule.content,
      images: rule.images || [],
      order: rule.order,
      createdAt: new Date(rule.createdAt),
      updatedAt: new Date(rule.updatedAt),
    };
  } catch (error) {
    console.error('Failed to fetch rule:', error);
    return null;
  }
}

export async function updateRuleOrder(ruleId: string, newOrder: number) {
  try {
    const db = await getCollection('rules');
    await db.findOneAndUpdate(
      { _id: new ObjectId(ruleId) },
      { $set: { order: newOrder, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    revalidatePath('/admin/rules');

    return { success: true };
  } catch (error) {
    console.error('Failed to update rule order:', error);
    return {
      success: false,
      error: `Failed to update the order of the rules: ${error}`,
    };
  }
}

export async function reorderRules(ruleIds: string[]) {
  try {
    // Create bulk write operations for efficient updating
    const bulkOps = ruleIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1, updatedAt: new Date() } },
      },
    }));

    // Execute all updates in a single operation
    const db = await getCollection('rules');
    const result = await db.bulkWrite(bulkOps);

    revalidatePath('/admin/rules');

    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Failed to reorder rules:', error);
    return { success: false, error: `Failed to reorder the rules: ${error}` };
  }
}

// Download Rules Button action
export async function downloadRulesPDF() {
  try {
    const pdfPath = join(
      process.cwd(),
      'public',
      'PvPPetBattleTournamentRules.pdf'
    );
    const pdfBuffer = await readFile(pdfPath);

    return {
      success: true,
      data: pdfBuffer.toString('base64'),
      mimeType: 'application/pdf',
    };
  } catch (error) {
    console.error('Error reading rules document:', error);
    return { success: false, error: 'Rules document not found' };
  }
}
