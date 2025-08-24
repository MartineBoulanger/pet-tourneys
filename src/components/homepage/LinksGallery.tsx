import { headerData } from '@/lib/navigationData';
import { Container } from '@/components/ui';
import { LinkCard } from './LinkCard';

export const LinksGallery = () => {
  return (
    <Container className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 w-full order-1 lg:order-0 lg:mb-10'>
      {headerData
        .filter((f) => f.id !== 1)
        .map((l) => (
          <LinkCard
            key={l.id}
            id={l.id}
            url={l.url}
            linkText={l.linkText}
            text={l.text}
            imageSrc={l.imageSrc}
          />
        ))}
    </Container>
  );
};
