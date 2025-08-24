// **************************************************************************
export interface ImageUpload {
  _id: string;
  src: string;
  alt: string;
  filename: string;
  filetype: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface Resource {
  _id: string;
  title: string;
  imageIds: string[];
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
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
