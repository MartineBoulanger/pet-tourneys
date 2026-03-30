import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { AdminLinkProps } from '@/types/components.types';

export function AdminLink({
  onClose,
  url,
  linkText,
  imageSrc,
}: AdminLinkProps) {
  return (
    <Link
      className={cn(
        'btn-link flex items-center border py-2 px-4 rounded-md border-blue-grey hover:bg-blue-grey hover:text-foreground ml-5',
        imageSrc ? 'justify-start gap-2.5' : 'justify-center py-4',
      )}
      href={url}
      title={linkText}
      aria-label={linkText}
      onClick={onClose}
    >
      {imageSrc && (
        <div className='w-8 h-8 flex-shrink-0'>
          <Image
            src={imageSrc}
            alt={linkText}
            width={32}
            height={32}
            className='w-full h-full object-cover'
            loading='lazy'
            unoptimized
          />
        </div>
      )}
      <span>{linkText}</span>
    </Link>
  );
}
