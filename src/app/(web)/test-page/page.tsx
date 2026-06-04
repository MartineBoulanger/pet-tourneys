import { Container } from '@/components/ui';
import { getTypes } from '@/actions/supabase/pets-schema/families/getFamilies';
import { PET_TYPE_IMAGES } from '@/types/supabase.types';
import { LuArrowBigUpDash, LuArrowBigDownDash } from 'react-icons/lu';

export default async function TestPage() {
  const { success, data } = await getTypes();
  if (!success) return null;
  return (
    <Container className='p-5'>
      <h1>{'Pet Types'}</h1>
      <div className='grid grid-cols-3 gap-5'>
        {data && data.length > 0
          ? data.map((type, index) => (
              <div
                key={type.type + index}
                className='flex flex-col justify-between p-5 rounded-lg bg-background/70 gap-2.5'
              >
                <div className='flex items-center gap-5'>
                  <img
                    src={PET_TYPE_IMAGES[type.type]}
                    alt={type.type}
                    height={40}
                    width={40}
                    className='border border-foreground/80 p-1 rounded-full bg-background'
                  />
                  <h2 className='text-foreground tracking-wider'>{type.type}</h2>
                </div>
                <div className='h-[1px] w-full bg-light-grey rounded-full' />
                <p className='text-yellow/90'>{type.passive}</p>
                <div className='h-[1px] w-full bg-light-grey rounded-full' />
                <div className='flex flex-col gap-1'>
                  <p className='mb-1 font-semibold'>{'Damage Taken'}</p>
                  <p className='flex items-center gap-1'>
                    <LuArrowBigUpDash className='text-green h-4 w-4' />
                    <span>{'50% from'}</span>
                    <span className='flex gap-1'>
                      <img
                        src={PET_TYPE_IMAGES[type.takes_more_from || 'Beast']}
                        alt={type.takes_more_from || 'take more damage from'}
                        height={18}
                        width={18}
                        className='border border-foreground/80 p-0.5 rounded-full'
                      />
                      {type.takes_more_from}
                    </span>
                    <span>{'abilities'}</span>
                  </p>
                  <p className='flex items-center gap-1'>
                    <LuArrowBigDownDash className='text-red h-4 w-4' />
                    <span>{'33% from'}</span>
                    <span className='flex gap-1'>
                      <img
                        src={PET_TYPE_IMAGES[type.takes_less_from || 'Beast']}
                        alt={type.takes_less_from || 'take less damage from'}
                        height={18}
                        width={18}
                        className='border border-foreground/80 p-0.5 rounded-full'
                      />
                      {type.takes_less_from}
                    </span>
                    <span>{'abilities'}</span>
                  </p>
                </div>
              </div>
            ))
          : null}
      </div>
    </Container>
  );
}
