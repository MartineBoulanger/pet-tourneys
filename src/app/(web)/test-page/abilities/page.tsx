import { Container } from '@/components/ui';
import { getAbilities } from '@/actions/supabase/pets-schema/abilities/getAbilities';

export default async function TestAbilitiesPage() {
  const { success, data } = await getAbilities();
  if (!success) return null;
  return (
    <Container className='p-5'>
      <h1>Pet Abilities</h1>
      <div className='grid grid-cols-4 gap-5'>
        {data && data.length > 0
          ? data.map((ab) => (
              <div
                key={ab.id}
                className='flex flex-col border border-dark-grey p-5 rounded-lg bg-background gap-2.5'
              >
                <div className='flex items-center gap-5'>
                  {ab.icon && (
                    <img src={ab.icon} alt={ab.name} height={40} width={40} />
                  )}
                  <h2>{ab.name}</h2>
                </div>
                <p className='text-lg font-bold mb-2'>{ab.type}</p>
                {ab.rounds === 1 ? null : <p>{ab.rounds} rounds ability</p>}
                {ab.cooldown && <p>{ab.cooldown} rounds cooldown</p>}
                <p>{ab.hit_chance}% hit chance</p>
                <p>{ab.description}</p>
                <p>{ab.effect}</p>
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
