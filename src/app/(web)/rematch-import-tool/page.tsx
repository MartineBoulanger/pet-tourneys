import { Importer } from '@/components/rematch-import-tool/Importer';
import { Container, Heading, Paragraph } from '@/components/ui';

export async function generateMetadata() {
  return {
    title: 'Rematch Import Tool',
    alternates: {
      canonical: `${process.env.BASE_URL!}/rematch-import-tool`,
    },
  };
}

export default function RematchImportToolPage() {
  return (
    <Container className='lg:px-5'>
      <Heading>{'Rematch Import Tool'}</Heading>
      <Paragraph className='text-center mb-5 max-w-[600px] mx-auto text-humanoid'>
        {'Import strings from your '}
        <span className='font-semibold text-cyan-500'>{'Rematch.lua'}</span>
        {' and '}
        <span className='font-semibold text-cyan-500'>
          {'tdBattlePetScript.lua'}
        </span>
      </Paragraph>
      <Paragraph className='text-center mb-2.5 max-w-[800px] mx-auto text-sm text-foreground/70'>
        {
          'Upload both files and every team you have saved comes back as a Rematch import string — pets, breeds, abilities, target NPC, notes and pet battle script. This is so you can import all your Rematch teams in the addon PetMatch, or just for backup.'
        }
      </Paragraph>
      <Paragraph className='text-center mb-5 max-w-[800px] mx-auto text-sm text-foreground/70'>
        {
          'Your SavedVariables are processed locally in your browser and are not uploaded.'
        }
      </Paragraph>
      <Importer />
    </Container>
  );
}
