'use client';

import { createResource } from '@/actions/supabase/cms-schema/resources/createResource';
import { updateResource } from '@/actions/supabase/cms-schema/resources/updateResource';
import { Resource } from '@/types/supabase.types';
import Selector from '@/components/cloudinary/Selector';
import { Button, Heading, Input } from '@/components/ui';
import { useCMSForm } from '@/hooks/useCMSForm';
import { ResourceFormProps } from '@/types/components.types';

export const ResourceForm = ({
  resource,
  onSuccess,
  onCancel,
}: ResourceFormProps) => {
  const emptyData: Resource = {
    id: '',
    title: '',
    images: [],
    index: 1,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleFieldChange,
    handleSubmit,
  } = useCMSForm<Resource>({
    initialData: resource ?? emptyData,
    emptyData,
    createFn: createResource,
    updateFn: updateResource,
    existingId: resource?.id,
    validate: (data) => (!data.title?.trim() ? 'Title is required' : null),
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {resource ? `Edit ${formData.title}` : 'Create New Resource'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
        <Input
          label='Resource title'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <Selector
          selectedImages={formData.images}
          onImagesSelect={(images) => handleFieldChange('images', images)}
          multiple
          label={'Choose images'}
          showPreview
        />

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

          <Button type='submit' disabled={!formData.title?.trim()}>
            {resource ? 'Edit Resource' : 'Create Resource'}
          </Button>
        </div>
      </form>
    </div>
  );
};
