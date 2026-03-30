'use client';

import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import { Button, Checkbox, Heading, Paragraph } from '@/components/ui';
import { PetModalProps } from '@/types/supabase.types';
import { Modal } from '@/components/layout';

export function PetModal({ pet, onClose, onEdit, onDelete }: PetModalProps) {
  const handleDelete = () => {
    if (confirm(`Delete ${pet.name}?`)) {
      onDelete(pet.id);
      onClose();
    }
  };

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

      <div className='p-2.5 lg:p-5 bg-background rounded-lg shadow-md'>
        <div className='grid md:grid-cols-2 gap-2.5 lg:gap-5'>
          {pet.image ? (
            <Image
              src={pet.image.secure_url}
              alt={pet.name}
              className='w-full rounded-lg shadow-md'
              width={400}
              height={400}
            />
          ) : (
            <div className='w-100 h-100 bg-dark-grey rounded-lg flex items-center justify-center'>
              <MdOutlineImageNotSupported className='w-20 h-20' />
            </div>
          )}

          <div className='space-y-2.5 lg:space-y-5'>
            <div>
              <Paragraph className='text-sm text-humanoid uppercase'>
                {'Type'}
              </Paragraph>
              <Paragraph className='text-lg font-semibold'>
                {pet.type}
              </Paragraph>
            </div>

            <div>
              <Paragraph className='text-sm text-humanoid uppercase'>
                {'Expansion'}
              </Paragraph>
              <Paragraph className='text-lg font-semibold'>
                {pet.expansion}
              </Paragraph>
            </div>

            <div>
              <Paragraph className='text-sm text-humanoid uppercase'>
                {'Source'}
              </Paragraph>
              <Paragraph className='text-lg font-semibold'>
                {pet.source || 'Unknown'}
              </Paragraph>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <Paragraph className='text-sm text-humanoid uppercase'>
                  {'Health'}
                </Paragraph>
                <Paragraph className='text-lg font-semibold'>
                  {pet.base_health || 'N/A'}
                </Paragraph>
              </div>
              <div>
                <Paragraph className='text-sm text-humanoid uppercase'>
                  {'Power'}
                </Paragraph>
                <Paragraph className='text-lg font-semibold'>
                  {pet.base_power || 'N/A'}
                </Paragraph>
              </div>
              <div>
                <Paragraph className='text-sm text-humanoid uppercase'>
                  {'Speed'}
                </Paragraph>
                <Paragraph className='text-lg font-semibold'>
                  {pet.base_speed || 'N/A'}
                </Paragraph>
              </div>
            </div>

            <div>
              <Paragraph className='text-sm text-humanoid uppercase'>
                {'Breeds'}
              </Paragraph>
              <Paragraph className='text-lg font-semibold'>
                {pet.breeds?.join(', ') || 'None'}
              </Paragraph>
            </div>

            <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

            <div className='flex gap-5 text-sm'>
              <Checkbox
                label='Tradable'
                id='is-tradable'
                name='is-tradable'
                checked={pet.is_tradable ?? false}
                disabled
              />
              <Checkbox
                label='Capturable'
                id='is-capturable'
                name='is-capturable'
                checked={pet.is_capturable ?? false}
                disabled
              />
              <Checkbox
                label='Vanity'
                id='is-vanity'
                name='is-vanity'
                checked={pet.is_vanity ?? false}
                disabled
              />
            </div>

            <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

            {(pet.is_horde || pet.is_alliance) && (
              <div>
                <div className='flex gap-4 text-sm'>
                  {pet.is_horde && (
                    <span className='text-red font-semibold'>
                      {'Horde Only'}
                    </span>
                  )}
                  {pet.is_alliance && (
                    <span className='text-blue font-semibold'>
                      {'Alliance Only'}
                    </span>
                  )}
                </div>
                <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />
              </div>
            )}
          </div>
        </div>

        {pet.description && (
          <div className='lg:mt-5'>
            <Paragraph className='text-sm text-humanoid uppercase'>
              {'Description'}
            </Paragraph>
            <Paragraph className='text-lg'>{pet.description}</Paragraph>
          </div>
        )}

        <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

        {(pet.ability_1 ||
          pet.ability_2 ||
          pet.ability_3 ||
          pet.ability_4 ||
          pet.ability_5 ||
          pet.ability_6) && (
          <div>
            <Paragraph className='text-sm text-humanoid uppercase'>
              {'Abilities'}
            </Paragraph>
            <div className='grid grid-cols-2 gap-2.5'>
              {pet.ability_1 && (
                <Paragraph>
                  {'1. '}
                  {pet.ability_1}
                </Paragraph>
              )}
              {pet.ability_2 && (
                <Paragraph>
                  {'2. '}
                  {pet.ability_2}
                </Paragraph>
              )}
              {pet.ability_3 && (
                <Paragraph>
                  {'3. '}
                  {pet.ability_3}
                </Paragraph>
              )}
              {pet.ability_4 && (
                <Paragraph>
                  {'4. '}
                  {pet.ability_4}
                </Paragraph>
              )}
              {pet.ability_5 && (
                <Paragraph>
                  {'5. '}
                  {pet.ability_5}
                </Paragraph>
              )}
              {pet.ability_6 && (
                <Paragraph>
                  {'6. '}
                  {pet.ability_6}
                </Paragraph>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center justify-center lg:justify-end gap-2.5 pt-2.5 lg:pt-5'>
        <Button
          onClick={() => {
            onEdit(pet);
            onClose();
          }}
          className='flex items-center justify-center gap-2'
        >
          <FaEdit className='w-4 h-4' />
          {'Edit Pet'}
        </Button>
        <Button
          onClick={handleDelete}
          variant='secondary'
          className='flex items-center justify-center gap-2'
        >
          <FaTrash className='w-4 h-4' />
          {'Delete Pet'}
        </Button>
      </div>
    </Modal>
  );
}
