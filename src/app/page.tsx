import { Carousel, TopView } from '@/components/homepage';
import { Container } from '@/components/ui';
import { partnersData } from '@/lib/partnersData';

export default function HomePage() {
  return (
    <Container className='sm:mt-0'>
      <TopView />
      <Carousel data={partnersData} className='min-h-90 xl:min-h-110' />
    </Container>
  );
}
