import { headerData } from '@/lib/navigationData';
import { Container } from '@/components/ui';
import { LinkCard } from './LinkCard';

export const LinksGallery = () => {
  return (
    <Container className='flex flex-wrap items-center justify-center gap-2.5 order-1 lg:order-0 lg:my-10'>
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
