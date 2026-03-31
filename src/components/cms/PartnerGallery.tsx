import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Heading, Container } from '@/components/ui';
import { AutoCarousel } from '@/components/layout/AutoCarousel';
import { PartnersGalleryProps } from '@/types/components.types';

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
          {data.map((partner) => (
            <Link
              key={partner.id}
              href={partner.link}
              className={cn(
                'btn-link text-sm md:text-base lg:text-lg flex flex-col items-center w-[150px] lg:w-[250px]',
                className,
              )}
              target='_blank'
              title={partner.partner}
              aria-label={partner.partner}
            >
              <span className='relative'>
                {partner.image ? (
                  <Image
                    src={partner.image.secure_url}
                    alt={partner.partner}
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
                ) : null}
              </span>
            </Link>
          ))}
        </AutoCarousel>
      </Container>
    </div>
  );
};
