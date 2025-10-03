import Link from 'next/link';
import Image from 'next/image';

type AdminLinkProps = {
  onClose: () => void;
  url: string;
  linkText: string;
  imageSrc: string;
};

export function AdminLink({
  onClose,
  url,
  linkText,
  imageSrc,
}: AdminLinkProps) {
  return (
    <Link
      className='btn-link flex items-center justify-start gap-2.5 border py-2 px-4 rounded-md border-blue-grey hover:bg-blue-grey hover:text-foreground ml-5'
      href={url}
      title={linkText}
      aria-label={linkText}
      onClick={onClose}
    >
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
      <span>{linkText}</span>
    </Link>
  );
}
