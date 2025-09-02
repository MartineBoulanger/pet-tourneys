'use client';

import { useState } from 'react';
import {
  createResource,
  updateResource,
} from '@/features/cms/actions/resources';
import { Resource as ResourceType } from '@/features/cms/types';
import ImageSelector from '@/features/cloudinary/components/Selector';
import { CloudinaryImage } from '@/features/cloudinary/types';
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
  const [formData, setFormData] = useState<ResourceType>({
    _id: resource?._id || '',
    title: resource?.title ?? '',
    images: resource?.images ?? [],
    createdAt: resource?.createdAt || new Date(),
    updatedAt: resource?.updatedAt || new Date(),
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesSelect = (images: CloudinaryImage[] | null) => {
    setFormData((prev) => ({
      ...prev,
      images: images,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }

    try {
      let result;
      if (resource?._id) {
        result = await updateResource(resource._id, formData);
      } else {
        result = await createResource(formData);
      }

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
      }
    } catch (err) {
      console.error(err);
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
          value={formData.title}
          onChange={handleChange}
          required
        />

        <ImageSelector
          selectedImages={formData.images}
          onImagesSelect={handleImagesSelect}
          multiple
          label={'Choose images'}
          showPreview
        />

        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}

        <div className='flex gap-2.5 lg:gap-5'>
          <Button
            type='submit'
            disabled={!formData.title?.trim()}
            className='flex-1'
          >
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
