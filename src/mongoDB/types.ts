import { Types } from 'mongoose';

// **************************************************************************
export interface MongoImageDocument {
  _id: Types.ObjectId;
  src: string;
  alt: string;
  width: number;
  height: number;
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
export interface MongoPrizeDocument {
  _id: Types.ObjectId;
  title: string;
  description: string;
  isCarousel: boolean;
  isColumnLayout: boolean;
  imagePosition: string;
  textAlignment: string;
  imageIds: string[];
  videoUrl: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}
export interface Prize {
  _id: string;
  title: string;
  description: string;
  isCarousel: boolean;
  isColumnLayout: boolean;
  imagePosition: string;
  textAlignment: string;
  imageIds: string[];
  videoUrl: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
