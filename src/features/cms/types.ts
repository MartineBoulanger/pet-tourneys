import { CloudinaryImage } from '@/features/cloudinary/types';

// **************************************************************************
export interface Resource {
  _id: string;
  title?: string;
  images: CloudinaryImage[] | null;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface Rule {
  _id: string;
  title: string;
  content: string;
  images: CloudinaryImage[] | null;
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
  images: CloudinaryImage[] | null;
  videoUrl: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface Announcement {
  _id: string;
  title?: string;
  description?: string;
  mediaType: 'image' | 'video' | 'none';
  image?: CloudinaryImage | null;
  videoUrl?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface Signup {
  _id: string;
  title: string;
  images: {
    image?: CloudinaryImage | null;
    imageName: string;
    imageAlt?: string;
    signupUrl: string;
    order?: number;
  }[];
  layout: '2' | '3' | '4';
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
export interface Schedule {
  _id: string;
  title: string;
  images: {
    image?: CloudinaryImage | null;
    imageName: string;
    imageDate: string;
    order?: number;
  }[];
  layout: '2' | '3' | '4';
  description?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// **************************************************************************
