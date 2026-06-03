import { Container } from '@/components/ui';
import { getTypes } from '@/actions/supabase/pets-schema/families/getFamilies';

export default async function TestPage() {
  const { success, data } = await getTypes();
  if (!success) return null;
  return (
    <Container className='p-5'>
      <h1>Pet Types</h1>
      <div className='grid grid-cols-2 gap-5'>
        {data && data.length > 0
          ? data.map((type, index) => (
              <div key={type.type + index} className='flex flex-col'>
                <h2>{type.type}</h2>
                <p>{type.passive}</p>
                <p>Pet Ability Strong VS: {type.strong_vs}</p>
                <p>Pet Ability Weak VS: {type.weak_vs}</p>
                <p>Takes more damage from: {type.takes_more_from}</p>
                <p>Takes less damage from: {type.takes_less_from}</p>
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
