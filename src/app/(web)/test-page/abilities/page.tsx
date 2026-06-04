import { Container } from '@/components/ui';
import { getAbilities } from '@/actions/supabase/pets-schema/abilities/getAbilities';
import { PET_TYPE_IMAGES } from '@/types/supabase.types';
import { LuArrowBigUpDash, LuArrowBigDownDash } from 'react-icons/lu';

export default async function TestAbilitiesPage() {
  const { success, data } = await getAbilities();
  if (!success) return null;
  return (
    <Container className='p-5'>
      <h1>{'Pet Abilities'}</h1>
      <div className='grid grid-cols-3 gap-5'>
        {data && data.length > 0
          ? data.map((ab) => (
              <div
                key={ab.id}
                className='flex flex-col justify-between p-5 rounded-lg bg-background/70 gap-2.5'
              >
                <div className='flex items-center justify-between gap-5'>
                  <div className='flex items-center gap-5'>
                    {ab.icon && (
                      <img src={ab.icon} alt={ab.name} height={40} width={40} />
                    )}
                    <h2 className='text-foreground tracking-wider'>
                      {ab.name}
                    </h2>
                  </div>
                  <img
                    src={PET_TYPE_IMAGES[ab.type]}
                    alt={ab.type}
                    height={40}
                    width={40}
                    className='border border-foreground/80 p-1 rounded-full bg-background'
                  />
                </div>
                <div className='h-[1px] w-full bg-light-grey rounded-full' />
                <div>
                  {ab.rounds === 1 ? null : (
                    <p>
                      {ab.rounds}
                      {' rounds ability'}
                    </p>
                  )}
                  {ab.cooldown && (
                    <p>
                      {ab.cooldown}
                      {' rounds cooldown'}
                    </p>
                  )}
                </div>
                <p className='text-yellow'>{`${ab.hit_chance}% hit chance`}</p>
                <p>{ab.description}</p>
                <p>{ab.effect}</p>
                <div className='h-[1px] w-full bg-light-grey rounded-full' />
                {ab.families && (
                  <>
                    <p className='flex items-center gap-2'>
                      <LuArrowBigUpDash className='text-green h-4.5 w-4.5' />
                      <span className='mx-2'>{'vs'}</span>
                      <span className='flex gap-1'>
                        <img
                          src={
                            PET_TYPE_IMAGES[ab.families.strong_vs || 'Beast']
                          }
                          alt={ab.type}
                          height={18}
                          width={18}
                          className='border border-foreground/80 p-0.5 rounded-full'
                        />
                        {ab.families.strong_vs}
                      </span>
                    </p>
                    <p className='flex items-center gap-2'>
                      <LuArrowBigDownDash className='text-red h-4.5 w-4.5' />
                      <span className='mx-2'>{'vs'}</span>
                      <span className='flex gap-1'>
                        <img
                          src={PET_TYPE_IMAGES[ab.families.weak_vs || 'Beast']}
                          alt={ab.type}
                          height={18}
                          width={18}
                          className='border border-foreground/80 p-0.5 rounded-full'
                        />
                        {ab.families.weak_vs}
                      </span>
                    </p>
                  </>
                )}
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
