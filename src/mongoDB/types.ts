import { Types } from 'mongoose';

// **************************************************************************
export interface MongoImageDocument {
  _id: Types.ObjectId;
  src: string;
  alt: string;
  width: number;
  height: number;
  usedIn: Types.ObjectId[];
  usedInModel?: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
export interface ImageUpload {
  _id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  usedIn: string[];
  usedInModel?: string;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface MongoResourceDocument {
  _id: Types.ObjectId;
  title: string;
  imageIds: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
export interface Resource {
  _id: string;
  title: string;
  imageIds: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface MongoRuleDocument {
  _id: Types.ObjectId;
  title: string;
  content: string;
  imageIds: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
export interface Rule {
  _id: string;
  title: string;
  content: string;
  imageIds: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
