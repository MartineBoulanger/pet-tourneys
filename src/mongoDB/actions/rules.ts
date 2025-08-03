'use server';

import dbConnect from '@/mongoDB/client';
import Rule from '../models/Rule';
import { Rule as R } from '../types';
import { revalidatePath } from 'next/cache';

export async function getAllRules() {
  try {
    await dbConnect();
    const rules = await Rule.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(rules));
  } catch (error) {
    console.error('Failed to fetch rules:', error);
    return [];
  }
}

export async function createRule() {
  try {
    await dbConnect();
    const count = await Rule.countDocuments();
    const rule = new Rule({
      title: 'New Rule',
      content: 'Please edit this rule...',
      order: count + 1,
    });
    const newRule = await Rule.create(rule);
    revalidatePath('/admin/rules');
    return JSON.parse(JSON.stringify(newRule));
  } catch (error) {
    console.error('Failed to create rule:', error);
  }
}

export async function updateRule(id: string, data: Partial<R>) {
  try {
    await dbConnect();
    await Rule.findByIdAndUpdate(id, data);
    revalidatePath('/admin/rules');
  } catch (error) {
    console.error('Failed to update rule:', error);
  }
}

export async function deleteRule(id: string) {
  try {
    await dbConnect();
    await Rule.findByIdAndDelete(id);
    revalidatePath('/admin/rules');
  } catch (error) {
    console.error('Failed to delete rule:', error);
  }
}
