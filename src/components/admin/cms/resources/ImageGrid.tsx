import { ImageUpload } from '@/mongoDB/types';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  images: ImageUpload[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 lg:gap-5'>
      {images.map((image) => (
        <ImageCard key={image._id} image={image} />
      ))}
    </div>
  );
}
