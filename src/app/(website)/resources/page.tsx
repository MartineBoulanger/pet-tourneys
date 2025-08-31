import { Container, Heading, Paragraph } from '@/components/ui';
import { ResourcesList } from '@/features/cms/components/resources/ResourcesList';

export async function generateMetadata() {
  return {
    title: 'Resources',
    description:
      'All our images are at your disposal to use, download them and mention us',
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
          'All these images are used in previous tournaments/leagues, as well in the current league, and of course for other stuff. We want them to be available for everyone to use, and share. Enjoy!'
        }
      </Paragraph>
      <ResourcesList />
    </Container>
  );
}
