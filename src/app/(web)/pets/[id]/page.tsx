import { notFound } from 'next/navigation';
import { getPet } from '@/actions/supabase/pets-schema/pets/getPets';
import { PageParams } from '@/types/global.types';
import { Container, Heading, Paragraph } from '@/components/ui';
import { PetDetails } from '@/components/pets/PetDetails';
import { PetIcon } from '@/components/pets/PetMedia';

export async function generateMetadata({ params }: { params: PageParams }) {
  const { id } = await params;
  return {
    title: 'Battle Pet Details',
    description: 'Battle pet details page',
    alternates: {
      canonical: `${process.env.BASE_URL!}/pets/${id}`,
    },
  };
}

export default async function PetDetailsPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const { data: pet, error } = await getPet(Number(id));

  if (error) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Error!'}</Heading>
        <Paragraph>{error}</Paragraph>
      </Container>
    );
  }

  if (!pet) return notFound();

  return (
    <Container className='lg:px-5'>
      <Heading className='mb-2.5 lg:mb-5 flex items-center gap-5'>
        <span>{pet.name}</span>
        <PetIcon pet={pet} />
      </Heading>
      <PetDetails pet={pet} />
    </Container>
  );
}
