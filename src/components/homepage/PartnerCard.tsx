import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { cn } from '@/utils/cn';

interface PartnerCardProps {
  partner: {
    image: string;
    name: string;
    link: string;
  };
  className?: string;
}

export const PartnerCard = ({ partner, className = '' }: PartnerCardProps) => {
  return (
    <Link
      href={partner.link}
      className={cn(
        'btn-link text-sm md:text-base lg:text-lg flex flex-col items-center w-[150px] lg:w-[250px]',
        className
      )}
      target='_blank'
      title={partner.name}
      aria-label={partner.name}
    >
      <span className='relative'>
        <Image
          src={partner.image}
          alt={partner.name}
          width={150}
          height={250}
          style={{
            width: 'auto',
            height: 'auto',
          }}
          className='w-full h-full object-contain'
          loading='lazy'
          unoptimized
        />
      </span>
      <span className='flex gap-1 items-start justify-center mt-2.5'>
        {partner.name}
        <FiExternalLink className='w-3 h-3 mt-1' />
      </span>
    </Link>
  );
};
