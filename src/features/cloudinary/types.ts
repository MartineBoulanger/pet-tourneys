export const BASE = process.env.CMS_BASE_URL!;

export type ImageRecord = {
  id: string;
  url: string;
  filename: string;
  title: string;
  alt: string;
  tags: string[];
  size: number;
  width: number | string;
  height: number | string;
  mimetype: string;
  uploadedAt: string;
  updatedAt?: string;
  custom?: Record<string, unknown>;
};

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
  // Add other Cloudinary properties you need
}
