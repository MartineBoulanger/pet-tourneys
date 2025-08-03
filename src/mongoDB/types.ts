import { Document } from 'mongoose';

export type StoreName = 'rules' | 'prizes' | 'stages' | 'schedule' | 'sign-ups';

export interface Rule {
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prize {
  title: string;
  description: string;
  value: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stage {
  title: string;
  description: string;
  image?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  filename: string;
  mimeType: string;
  size: number;
  data: BufferConstructor;
  createdAt: Date;
}

export type StoreType<T extends StoreName> = T extends 'rules'
  ? Rule
  : T extends 'prizes'
  ? Prize
  : T extends 'stages'
  ? Stage
  : never;

export interface iRuleDocument extends Rule, Document {}
export interface iPrizeDocument extends Prize, Document {}
export interface iStageDocument extends Stage, Document {}
export interface iImageDocument extends Image, Document {}
