import Image from 'next/image';
import Link from 'next/link';
import { homepageLinks } from '@/lib/navigation-data/homepage';
import { Container, Heading } from '@/components/ui';

export const HomePageLinks = () => {
  return (
    <Container className='flex flex-wrap items-center justify-center gap-2.5 lg:gap-5 order-1 lg:order-0 lg:my-10'>
      {homepageLinks.map((l) => (
        <Link
          key={l.id}
          href={l.url}
          className='p-2.5 bg-light-grey shadow-md rounded-lg flex self-stretch w-full min-[850]:w-[30%]'
          title={l.linkText}
          aria-label={l.linkText}
        >
          <span className='flex flex-col items-center content-between justify-between gap-5 bg-background p-2.5 lg:p-5 rounded-lg hover:scale-[1.02] transition-all duration-300'>
            <span className='w-[150px] h-[150px]'>
              <Image
                src={l.imageSrc ?? ''}
                alt={l.text}
                width={100}
                height={100}
                className='w-full h-full object-contain'
                loading='lazy'
              />
            </span>
            <span className='text-center'>
              <Heading
                as='h2'
                className='text-humanoid mx-auto text-[20px] mb-2.5'
              >
                {l.linkText}
              </Heading>
              <span className='text-foreground'>{l.text}</span>
            </span>
          </span>
        </Link>
      ))}
    </Container>
  );
};
