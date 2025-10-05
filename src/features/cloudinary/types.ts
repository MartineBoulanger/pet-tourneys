export const BASE = process.env.CMS_BASE_URL!;
// **************************************************************************
export type CloudinaryImage = {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
};
// **************************************************************************
export type ImageSelectorProps = {
  onImageSelect?: (image: CloudinaryImage | null) => void;
  onImagesSelect?: (images: CloudinaryImage[] | null) => void;
  selectedImage?: CloudinaryImage | null;
  selectedImages?: CloudinaryImage[] | null;
  folder?: string;
  label?: string;
  showPreview?: boolean;
  required?: boolean;
  multiple?: boolean;
};
// **************************************************************************
export type ImagesManagerProps = {
  folder: string;
  initImages: CloudinaryImage[];
  nextCursor?: string | null;
  path: string;
};
// **************************************************************************
export type ImagesToolbarProps = {
  folder: string;
  images: CloudinaryImage[];
  setImages: (imgs: CloudinaryImage[]) => void;
  selected: string[];
  setSelected: (ids: string[]) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onBulkDelete: (publicIds: string[]) => void;
  setNextCursor: (cursor: string) => void;
};
// **************************************************************************
export type ImagesGridProps = {
  images: CloudinaryImage[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  viewMode: 'grid' | 'list';
  onDelete: (publicId: string) => void;
  onView: (img: CloudinaryImage) => void;
  path: string;
};
// **************************************************************************
export type ImageCardProps = {
  image: CloudinaryImage;
  selected: boolean;
  toggleSelection: (id: string) => void;
  onView: () => void;
  viewMode: 'grid' | 'list';
  onDelete: (publicId: string) => void;
};
// **************************************************************************
export type ImageUploadFormProps = {
  folder?: string;
  onUploadSuccess?: () => void;
  path: string;
};
// **************************************************************************
export type ImageModalProps = {
  image: CloudinaryImage;
  onClose: () => void;
  onDelete: (publicId: string) => void;
};
// **************************************************************************
