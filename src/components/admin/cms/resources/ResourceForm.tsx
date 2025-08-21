'use client';

import { useState } from 'react';
import { createResource, updateResource } from '@/mongoDB/actions/resources';
import { Resource as ResourceType } from '@/mongoDB/types';
import ImageSelector from '../ImageSelector';
import { Button, Heading, Input } from '@/components/ui';

interface ResourceFormProps {
  resource?: ResourceType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ResourceForm = ({
  resource,
  onSuccess,
  onCancel,
}: ResourceFormProps) => {
  const [title, setTitle] = useState<string>(resource?.title || '');
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    resource?.imageIds || []
  );
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    selectedImageIds.forEach((imageId) => {
      formData.append('imageIds', imageId);
    });

    try {
      let result;
      if (resource?._id) {
        result = await updateResource(resource._id, formData);
      } else {
        result = await createResource(formData);
      }

      if (result.success) {
        setTitle('');
        setSelectedImageIds([]);
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
      }

      setTitle(title);
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid font-medium mb-2.5'>
        {resource ? 'Edit Resource' : 'Create Resource'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        <Input
          label='Resource title'
          name='title'
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <ImageSelector
          selectedImageIds={selectedImageIds}
          onImagesSelect={(images) => {
            const imageIds = images.map((img) => img._id);
            setSelectedImageIds(imageIds);
          }}
          multiple
          maxSelection={10}
          label={'Choose images'}
          showPreview={true}
          allowNull={true}
        />

        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}

        <div className='flex gap-2.5 lg:gap-5'>
          <Button type='submit' disabled={!title.trim()} className='flex-1'>
            {resource ? 'Edit' : 'Create'}
          </Button>

          {onCancel && (
            <Button type='button' variant='secondary' onClick={onCancel}>
              {'Cancel'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
