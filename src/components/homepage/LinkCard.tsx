import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '@/components/ui';

interface LinkCardProps {
  id: number;
  url: string;
  linkText: string;
  text: string;
  imageSrc: string;
}

export const LinkCard = ({
  id,
  url,
  linkText,
  text,
  imageSrc,
}: LinkCardProps) => {
  return (
    <Link
      key={id}
      href={url}
      className='p-2.5 bg-light-grey shadow-md rounded-lg flex'
      title={linkText}
      aria-label={linkText}
    >
      <span className='flex flex-col items-center content-between justify-between gap-5 bg-background p-2.5 lg:p-5 rounded-lg hover:scale-[1.02] transition-all duration-300'>
        <span className='w-[150px] h-[150px]'>
          <Image
            src={imageSrc}
            alt={text}
            width={100}
            height={100}
            className='w-full h-full object-contain'
          />
        </span>
        <span className='text-center'>
          <Heading as='h2' className='text-humanoid text-[20px] mb-2.5'>
            {linkText}
          </Heading>
          <span className='text-foreground'>{text}</span>
        </span>
      </span>
    </Link>
  );
};
