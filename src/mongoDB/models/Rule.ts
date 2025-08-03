import { Schema, model, models } from 'mongoose';
import { iRuleDocument, Rule } from '../types';

const RuleSchema = new Schema<iRuleDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Rule || model<Rule>('Rule', RuleSchema);
