// =================================================
// Image object from Cloudinary structure
// =================================================
export type CloudinaryImage = {
  public_id: string;
  display_name: string;
  original_filename: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
};

// =================================================
// The field to select image(s)
// =================================================
export type SelectorProps = {
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

// =================================================
// Cloudinary manager
// =================================================
export type CloudinaryProps = {
  folder: string;
  initImages?: CloudinaryImage[];
  nextCursor?: string | null;
  path: string;
};

// =================================================
// The search & actions bar
// =================================================
export type ToolbarProps = {
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

// =================================================
// The grid/list layout of the images
// =================================================
export type LayoutProps = {
  images: CloudinaryImage[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  viewMode: 'grid' | 'list';
  onDelete: (publicId: string) => void;
  onView: (img: CloudinaryImage) => void;
  path: string;
};

// =================================================
// Image card
// =================================================
export type CardProps = {
  image: CloudinaryImage;
  selected: boolean;
  toggleSelection: (id: string) => void;
  onView: () => void;
  viewMode: 'grid' | 'list';
  onDelete: (publicId: string) => void;
};

// =================================================
// Image upload form
// =================================================
export type UploadFormProps = {
  folder?: string;
  path: string;
  onUploadSuccess?: () => void;
};
export type UploadedImage = {
  file: File;
  preview: string;
};

// =================================================
// Popup to view full image
// =================================================
export type ModalProps = {
  image: CloudinaryImage;
  onClose: () => void;
  onDelete: (publicId: string) => void;
};
