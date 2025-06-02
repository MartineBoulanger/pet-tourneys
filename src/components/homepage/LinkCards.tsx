import Link from 'next/link';
import Image from 'next/image';
import { headerData } from '@/lib/navigationData';
import { Heading, Container, Paragraph } from '@/components/ui';

export const LinkCards = () => {
  return (
    <Container className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-5 w-full lg:w-1/2'>
      {headerData.map((l) => (
        <Link
          key={l.id}
          href={l.url}
          className='p-2.5 sm:p-5 bg-light-grey shadow-md rounded-lg flex'
          title={l.linkText}
          aria-label={l.linkText}
        >
          <span className='flex flex-col items-center content-between justify-between gap-5 bg-background p-2.5 sm:p-5 rounded-lg hover:scale-[1.02] transition-all duration-300'>
            <span className='w-[150px] h-[150px]'>
              <Image
                src={l.imageSrc}
                alt={l.text}
                width={100}
                height={100}
                className='w-full h-full object-contain'
              />
            </span>
            <span className='text-center'>
              <Heading as='h2' className='text-humanoid text-[20px] mb-2.5'>
                {l.linkText}
              </Heading>
              <Paragraph>{l.text}</Paragraph>
            </span>
          </span>
        </Link>
      ))}
    </Container>
  );
};
