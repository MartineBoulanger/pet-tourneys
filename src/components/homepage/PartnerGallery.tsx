import { cn } from '@/utils/cn';
import { Heading, AutoCarousel, Container } from '../ui';
import { PartnerCard } from './PartnerCard';
import { PartnersData } from '@/lib/types';

interface PartnersGalleryProps {
  data: PartnersData;
  className?: string;
}

export const PartnerGallery = ({ data, className }: PartnersGalleryProps) => {
  return (
    <div className='bg-light-grey py-5 lg:py-10'>
      <Heading className='mb-5'>{'Proud to partner with'}</Heading>
      <Container className='px-0 lg:px-0'>
        <AutoCarousel
          speed={30}
          gap={50}
          className={cn('py-5 lg:py-10', className)}
        >
          {data.map((partner, index) => (
            <PartnerCard key={index + data.length} partner={partner} />
          ))}
        </AutoCarousel>
      </Container>
    </div>
  );
};
