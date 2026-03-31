'use client';

import { createHalloffame } from '@/actions/supabase/cms-schema/halloffame/createHalloffame';
import { updateHalloffame } from '@/actions/supabase/cms-schema/halloffame/updateHalloffame';
import { HallOfFame } from '@/types/supabase.types';
import Selector from '@/components/cloudinary/Selector';
import { Button, Heading, Input, Select, Option } from '@/components/ui';
import { useCMSForm } from '@/hooks/useCMSForm';
import { HalloffameFormProps } from '@/types/components.types';

export function HalloffameForm({
  hofItem,
  onSuccess,
  onCancel,
}: HalloffameFormProps) {
  const emptyData: HallOfFame = {
    id: '',
    season: '',
    champion: '',
    region: 'na',
    avatar: null,
    runnerup: '',
    petname: '',
    petavatar: null,
    finalsvideourl: '',
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleFieldChange,
    handleSelectChange,
    handleSubmit,
  } = useCMSForm<HallOfFame>({
    initialData: hofItem ?? emptyData,
    emptyData,
    createFn: createHalloffame,
    updateFn: updateHalloffame,
    existingId: hofItem?.id,
    validate: (data) =>
      !data.season?.trim() || !data.champion?.trim() || !data.runnerup?.trim()
        ? 'Season, champion name, and runner-up name are required'
        : null,
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {hofItem ? `Edit ${formData.season}` : 'Create New Hall of Fame'}
      </Heading>
      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        <Input
          label='Season'
          name='season'
          id='season'
          value={formData.season}
          onChange={handleInputChange}
          required
        />
        <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-light-grey' />
        <Input
          label='Champion Name'
          name='champion'
          id='champion'
          value={formData.champion}
          onChange={handleInputChange}
          required
        />
        <Selector
          selectedImage={formData.avatar}
          onImageSelect={(avatar) => handleFieldChange('avatar', avatar)}
          label={'Choose champion avatar'}
          showPreview
        />
        <Select
          label='Champion Region'
          id='region'
          name='region'
          value={formData.region}
          onChange={handleSelectChange}
        >
          <Option value='na' label='NA' />
          <Option value='eu' label='EU' />
          <Option value='oce' label='OCE' />
          <Option value='cn' label='CN' />
        </Select>
        <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-light-grey' />
        <Input
          label='Runner-Up Name'
          name='runnerup'
          id='runnerup'
          value={formData.runnerup}
          onChange={handleInputChange}
          required
        />
        <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-light-grey' />
        <Input
          label='Pet Name'
          name='petname'
          id='petname'
          value={formData.petname || ''}
          onChange={handleInputChange}
        />
        <Selector
          selectedImage={formData.petavatar}
          onImageSelect={(petavatar) =>
            handleFieldChange('petavatar', petavatar)
          }
          label={'Choose pet avatar'}
          showPreview
        />
        <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-light-grey' />
        <Input
          label='Finals video URL'
          id='finalsvideourl'
          name='finalsvideourl'
          value={formData.finalsvideourl || ''}
          onChange={handleInputChange}
        />
        <div className='rounded-full w-full h-0.5 my-5 mx-auto bg-light-grey' />
        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}

        <div className='flex justify-end gap-2.5'>
          {onCancel && (
            <Button type='button' variant='secondary' onClick={onCancel}>
              {'Cancel'}
            </Button>
          )}
          <Button
            type='submit'
            disabled={
              !formData.season.trim() ||
              !formData.champion.trim() ||
              !formData.runnerup.trim()
            }
          >
            {hofItem ? 'Edit Hall of Fame' : 'Create Hall of Fame'}
          </Button>
        </div>
      </form>
    </div>
  );
}
