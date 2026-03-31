import Image from 'next/image';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Pet, PET_TYPE_IMAGES } from '@/types/supabase.types';

// Pet icon for the title on pet details page
export function PetIcon({ pet }: { pet: Pet }) {
  return (
    <div className='flex items-center h-[40px] w-[40px] mt-1'>
      {pet.icon ? (
        <Image
          src={pet.icon?.secure_url || ''}
          alt={pet.name}
          className='w-full h-full object-contain'
          width={40}
          height={40}
          loading='lazy'
        />
      ) : (
        <div className='w-[40px] h-[40px] bg-light-grey flex items-center justify-center rounded-md'>
          <MdOutlineImageNotSupported className='h-4 w-4 text-foreground' />
        </div>
      )}
    </div>
  );
}

// Pet image for the pet details page
export function PetImage({ pet }: { pet: Pet }) {
  return (
    <div className='w-full lg:w-[400px] h-full lg:h-[400px] flex items-center justify-center rounded-lg  overflow-hidden bg-background shadow-sm justify-self-center'>
      {pet.image ? (
        <Image
          src={pet.image.secure_url}
          alt={pet.name}
          className='w-full h-full object-contain'
          width={400}
          height={400}
          loading='lazy'
        />
      ) : (
        <div className='w-[400px] h-[400px] bg-light-grey flex items-center justify-center'>
          <MdOutlineImageNotSupported className='w-20 h-20' />
        </div>
      )}
    </div>
  );
}

// Pet image for the pet card on the overview page
export function PetCardImage({ pet }: { pet: Pet }) {
  return (
    <div className='w-20 h-20 flex items-center justify-center mb-2.5 rounded-md overflow-hidden bg-background'>
      {pet.image ? (
        <Image
          src={pet.image?.secure_url}
          alt={pet.name}
          className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-300'
          width={80}
          height={80}
          loading='lazy'
        />
      ) : (
        <div className='w-20 h-20 bg-light-grey flex items-center justify-center rounded-md'>
          <MdOutlineImageNotSupported className='w-8 h-8' />
        </div>
      )}
    </div>
  );
}

// Pet type image as background image on the pet details page
export function PetTypeImage({ pet }: { pet: Pet }) {
  return (
    <div className='absolute bottom-0 right-0 opacity-10 w-[250px] lg:w-[400px] h-[250px] lg:h-[400px]'>
      <Image
        src={PET_TYPE_IMAGES[pet.type as keyof typeof PET_TYPE_IMAGES]}
        alt={`${pet.type} Icon`}
        width={250}
        height={250}
        className='w-full h-full object-cover'
        loading='lazy'
      />
    </div>
  );
}
