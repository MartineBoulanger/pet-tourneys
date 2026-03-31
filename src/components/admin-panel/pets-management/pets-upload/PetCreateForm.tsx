'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPet } from '@/actions/supabase/pets-schema/pets/createPet';
import { toastError, toastSuccess } from '@/utils/toast';
import {
  PetType,
  PetBreed,
  PetSource,
  PetExpansion,
  PetData,
} from '@/types/supabase.types';
import { Constants } from '@/types/pets.types';
import {
  Input,
  Form,
  Select,
  Option,
  Checkbox,
  Textarea,
  Heading,
} from '@/components/ui';
import Selector from '@/components/cloudinary/Selector';
import { CloudinaryImage } from '@/types/cloudinary.types';
import { cn } from '@/utils/cn';

const PET_TYPES = Constants['pets']['Enums']['types'];
const PET_BREEDS = Constants['pets']['Enums']['breeds'];
const PET_SOURCES = Constants['pets']['Enums']['sources'];
const PET_EXPANSIONS = Constants['pets']['Enums']['expansions'];

export function PetCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<CloudinaryImage | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(
    null,
  );
  const [formData, setFormData] = useState<Omit<PetData, 'icon' | 'image'>>({
    id: 0,
    name: '',
    type: 'Beast',
    expansion: 'Classic',
    is_tradable: true,
    is_capturable: true,
    is_vanity: false,
    is_horde: false,
    is_alliance: false,
  });
  const [selectedBreeds, setSelectedBreeds] = useState<PetBreed[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      icon: selectedIcon || null,
      image: selectedImage || null,
      breeds: selectedBreeds.length > 0 ? selectedBreeds : null,
      base_health: formData.base_health || 0,
      base_power: formData.base_power || 0,
      base_speed: formData.base_speed || 0,
    };

    const result = await createPet(dataToSubmit, '/admin-panel/pets');

    if (result.success) {
      toastSuccess('Pet created successfully!');
      router.push('/admin-panel/pets');
    } else {
      toastError(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  const toggleBreed = (breed: PetBreed) => {
    setSelectedBreeds((prev) =>
      prev && prev.includes(breed)
        ? prev.filter((b) => b !== breed)
        : [...prev, breed],
    );
  };

  return (
    <Form
      handleSubmit={handleSubmit}
      button1={{ type: 'button', variant: 'secondary', text: 'Cancel' }}
      handleClick={() => router.push('/admin-panel/pets')}
      button2={{
        type: 'submit',
        variant: 'primary',
        text: loading ? 'Creating...' : 'Create Pet',
      }}
    >
      {/* Basic Information */}
      <div className='space-y-5'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid'>
          {'Basic Information'}
        </Heading>

        <div className='grid md:grid-cols-2 gap-4'>
          <Input
            label='Pet ID (Blizzard ID)'
            id='pet-id'
            name='pet-id'
            type='number'
            required
            value={formData.id || 0}
            onChange={(e) =>
              setFormData({
                ...formData,
                id: parseInt(e.target.value) || 0,
              })
            }
          />

          <Input
            label='Name'
            id='pet-name'
            name='pet-name'
            type='text'
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className='grid md:grid-cols-3 gap-4'>
          <Select
            label='Type'
            id='pet-type'
            name='pet-type'
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as PetType })
            }
          >
            {PET_TYPES.map((type) => (
              <Option key={type} value={type} label={type} />
            ))}
          </Select>

          <Select
            label='Expansion'
            id='pet-expansion'
            name='pet-expansion'
            value={formData.expansion}
            onChange={(e) =>
              setFormData({
                ...formData,
                expansion: e.target.value as PetExpansion,
              })
            }
          >
            {PET_EXPANSIONS.map((exp) => (
              <Option key={exp} value={exp} label={exp} />
            ))}
          </Select>

          <Select
            label='Source'
            id='pet-source'
            name='pet-source'
            value={formData.source || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                source: e.target.value as PetSource,
              })
            }
          >
            <Option value='' label='Select Source (Optional)' />
            {PET_SOURCES.map((source) => (
              <Option key={source} value={source} label={source} />
            ))}
          </Select>
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Images */}
      <div className='space-y-4'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid pb-2'>
          {'Image & Icon'}
        </Heading>

        <div className='grid md:grid-cols-2 gap-4'>
          <Selector
            folder='pml-pet-images'
            label='Pet Image'
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            showPreview={true}
          />

          <Selector
            folder='pml-pet-icons'
            label='Pet Icon'
            selectedImage={selectedIcon}
            onImageSelect={setSelectedIcon}
            showPreview={true}
          />
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Stats */}
      <div className='space-y-4'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid pb-2'>
          {'Base Stats'}
        </Heading>

        <div className='grid md:grid-cols-3 gap-4'>
          <Input
            label='Base Health'
            id='pet-base-health'
            name='pet-base-health'
            type='number'
            step='0.1'
            value={formData.base_health || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_health: parseFloat(e.target.value) || null,
              })
            }
          />

          <Input
            label='Base Power'
            id='pet-base-power'
            name='pet-base-power'
            type='number'
            step='0.1'
            value={formData.base_power || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_power: parseFloat(e.target.value) || null,
              })
            }
          />

          <Input
            label='Base Speed'
            id='pet-base-speed'
            name='pet-base-speed'
            type='number'
            step='0.1'
            value={formData.base_speed || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_speed: parseFloat(e.target.value) || null,
              })
            }
          />
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Breeds */}
      <div className='space-y-4'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid pb-2'>
          {'Breeds'}
        </Heading>

        <div className='flex flex-wrap gap-2'>
          {PET_BREEDS.map((breed) => (
            <div
              key={breed}
              className={cn(
                'px-2 py-1 border border-foreground/50 rounded-md transition-all duration-300 hover:border-foreground cursor-pointer',
                selectedBreeds.includes(breed) &&
                  'bg-humanoid border-foreground',
              )}
            >
              <Checkbox
                label={breed}
                id={breed}
                name={breed}
                onChange={() => toggleBreed(breed)}
                checked={selectedBreeds.includes(breed)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Abilities */}
      <div className='space-y-4'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid pb-2'>
          {'Abilities'}
        </Heading>

        <div className='grid md:grid-cols-2 gap-5'>
          <Input
            label='Ability 1'
            id='pet-ability-1'
            name='pet-ability-1'
            type='text'
            value={formData.ability_1 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_1: e.target.value || null,
              })
            }
          />
          <Input
            label='Ability 2'
            id='pet-ability-2'
            name='pet-ability-2'
            type='text'
            value={formData.ability_2 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_2: e.target.value || null,
              })
            }
          />
          <Input
            label='Ability 3'
            id='pet-ability-3'
            name='pet-ability-3'
            type='text'
            value={formData.ability_3 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_3: e.target.value || null,
              })
            }
          />
          <Input
            label='Ability 4'
            id='pet-ability-4'
            name='pet-ability-4'
            type='text'
            value={formData.ability_4 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_4: e.target.value || null,
              })
            }
          />
          <Input
            label='Ability 5'
            id='pet-ability-5'
            name='pet-ability-5'
            type='text'
            value={formData.ability_5 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_5: e.target.value || null,
              })
            }
          />
          <Input
            label='Ability 6'
            id='pet-ability-6'
            name='pet-ability-6'
            type='text'
            value={formData.ability_6 || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                ability_6: e.target.value || null,
              })
            }
          />
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Flags */}
      <div className='space-y-4'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid pb-2'>
          {'Flags'}
        </Heading>

        <div className='grid md:grid-cols-3 gap-4'>
          <Checkbox
            label={'Tradable'}
            id={'tradable'}
            name={'tradable'}
            onChange={(e) =>
              setFormData({ ...formData, is_tradable: e.target.checked })
            }
            checked={formData.is_tradable ?? false}
          />

          <Checkbox
            label={'Capturable'}
            id={'capturable'}
            name={'capturable'}
            onChange={(e) =>
              setFormData({ ...formData, is_capturable: e.target.checked })
            }
            checked={formData.is_capturable ?? false}
          />

          <Checkbox
            label={'Vanity'}
            id={'vanity'}
            name={'vanity'}
            onChange={(e) =>
              setFormData({ ...formData, is_vanity: e.target.checked })
            }
            checked={formData.is_vanity ?? false}
          />

          <Checkbox
            label={'Horde Only'}
            id={'horde'}
            name={'horde'}
            onChange={(e) =>
              setFormData({ ...formData, is_horde: e.target.checked })
            }
            checked={formData.is_horde ?? false}
          />

          <Checkbox
            label={'Alliance Only'}
            id={'alliance'}
            name={'alliance'}
            onChange={(e) =>
              setFormData({ ...formData, is_alliance: e.target.checked })
            }
            checked={formData.is_alliance ?? false}
          />
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Description */}
      <Textarea
        label='Description'
        id='pet-description'
        name='pet-description'
        value={formData.description || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value || null,
          })
        }
        rows={4}
        placeholder='Write pet description...'
      />

      <div className='rounded-full w-full h-[1px] mt-5 mx-auto bg-blue-grey' />
    </Form>
  );
}
