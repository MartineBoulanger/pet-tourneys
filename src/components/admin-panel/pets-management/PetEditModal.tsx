'use client';

import Image from 'next/image';
import { PetEditModalProps } from '@/types/components.types';
import { PetEditForm } from './pets-upload/PetEditForm';
import { Heading } from '@/components/ui';
import { Modal } from '@/components/layout';

export function PetEditModal({ pet, onClose, onSuccess }: PetEditModalProps) {
  return (
    <Modal
      onClose={onClose}
      show={!!pet}
      className='lg:max-w-4xl w-full max-h-[90vh]'
    >
      <Heading as='h2' className='mb-2.5 lg:mb-5'>
        {pet.icon ? (
          <Image
            src={pet.icon?.secure_url}
            alt={pet.name}
            className='w-10 h-10 mr-2.5 lg:mr-5 inline-block'
            width={24}
            height={24}
          />
        ) : null}
        {pet.name}
      </Heading>
      <div className='max-h-[80vh] overflow-y-auto rounded-lg shadow-md'>
        <PetEditForm pet={pet} onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </Modal>
  );
}
