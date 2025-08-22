import { Container, Heading, Paragraph } from '@/components/ui';
import { ResourcesList } from '@/components/admin/cms/resources/ResourcesList';

export async function generateMetadata() {
  return {
    title: 'Resources',
    alternates: {
      canonical: `${process.env.BASE_URL!}/resources`,
    },
  };
}

export default async function ResourcesPage() {
  return (
    <Container className='lg:px-5'>
      <Heading className='text-center'>{'Resources'}</Heading>
      <Paragraph className='max-w-[700px] text-center mx-auto mb-5'>
        {
          'All these images are used in previous tournaments, and other previous stuff, and we want them to be available for everyone to use. Enjoy!'
        }
      </Paragraph>
      <ResourcesList />
    </Container>
  );
}
