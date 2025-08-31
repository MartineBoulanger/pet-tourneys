import { cn } from '@/utils/cn';
import { Heading } from '../ui';
import { PartnerCard } from './PartnerCard';

interface PartnersGalleryProps {
  data: {
    image: string;
    name: string;
    isPriority?: boolean;
  }[];
  className?: string;
}

export const PartnerGallery = ({ data, className }: PartnersGalleryProps) => {
  const priorityPartners = data.filter((partner) => partner.isPriority);
  const regularPartners = data.filter((partner) => !partner.isPriority);

  return (
    <div className='bg-light-grey py-5 lg:py-10 px-5 md:px-0'>
      <Heading className='text-center tracking-wider'>
        {'Proud to partner with'}
      </Heading>
      <div className={cn('relative mx-auto', className)}>
        <div className='flex items-center justify-center gap-2.5 mb-5 lg:mb-10'>
          {priorityPartners.slice(0, 1).map((partner, index) => (
            <PartnerCard key={index} partner={partner} size='medium' />
          ))}
          {priorityPartners.slice(1, 2).map((partner, index) => (
            <PartnerCard
              key={index + 1}
              partner={partner}
              size='large'
              className='z-10'
            />
          ))}
          {priorityPartners.slice(2, 3).map((partner, index) => (
            <PartnerCard key={index + 2} partner={partner} size='medium' />
          ))}
        </div>

        <div className='flex items-center justify-center gap-5 lg:gap-10 flex-wrap'>
          {regularPartners.map((partner, index) => (
            <PartnerCard
              key={index + priorityPartners.length}
              partner={partner}
              size='small'
            />
          ))}
        </div>
      </div>
    </div>
  );
};
