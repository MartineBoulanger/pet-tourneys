import { notFound } from 'next/navigation';
import { getAllPets } from '@/actions/supabase/pets-schema/pets/getPets';
import { PetGrid } from '@/components/pets/PetGrid';
import { Container, Heading, Paragraph } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Battle Pets',
    description: 'All pets from World of Warcraft',
    alternates: {
      canonical: `${process.env.BASE_URL!}/pets`,
    },
  };
}

export default async function PetsPage() {
  const { data, error } = await getAllPets();

  if (error) {
    return (
      <Container className='text-center'>
        <Heading className='text-red'>{'Error!'}</Heading>
        <Paragraph>{error}</Paragraph>
      </Container>
    );
  }

  if (!data) return notFound();

  return (
    <Container>
      <Heading>{'Battle Pets'}</Heading>
      {data.length > 0 ? (
        <PetGrid pets={data} />
      ) : (
        <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
          {'There are no pets available yet.'}
        </Paragraph>
      )}
    </Container>
  );
}
