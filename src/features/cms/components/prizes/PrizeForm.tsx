'use client';

import { useState } from 'react';
import { createPrize, updatePrize } from '@/features/cms/actions/prizes';
import { Prize as PrizeType } from '@/features/cms/types';
import ImageSelector from '@/features/cloudinary/components/Selector';
import { CloudinaryImage } from '@/features/cloudinary/types';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
} from '@/components/ui';
import { RichTextEditor } from '../RichTextEditor';

interface PrizeFormProps {
  prize?: PrizeType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PrizeForm({ prize, onSuccess, onCancel }: PrizeFormProps) {
  const [formData, setFormData] = useState<PrizeType>({
    _id: prize?._id || '',
    title: prize?.title ?? '',
    description: prize?.description ?? '',
    isCarousel: prize?.isCarousel ?? false,
    isColumnLayout: prize?.isColumnLayout ?? false,
    imagePosition: prize?.imagePosition ?? 'bottom',
    textAlignment: prize?.textAlignment ?? 'left',
    images: prize?.images ?? [],
    videoUrl: prize?.videoUrl ?? '',
    createdAt: prize?.createdAt || new Date(),
    updatedAt: prize?.updatedAt || new Date(),
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setFormData((prev) => ({
      ...prev,
      description,
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

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    } else if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      let result;
      if (prize?._id) {
        result = await updatePrize(prize._id, formData);
      } else {
        result = await createPrize(formData);
      }

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          description: '',
          isCarousel: false,
          isColumnLayout: false,
          imagePosition: 'bottom',
          textAlignment: 'left',
          images: [],
          videoUrl: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error(error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid font-medium mb-2.5'>
        {prize ? 'Edit Prize' : 'Create Prize'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        <Input
          label='Prize title'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className='block mb-0.5'>{'Prize description:'}</label>
          <RichTextEditor
            content={formData.description}
            onChange={handleDescriptionChange}
            className='min-h-[400px]'
          />
        </div>

        <Select
          label='Text alignment'
          id='textAlignment'
          name='textAlignment'
          value={formData.textAlignment}
          onChange={handleSelectChange}
        >
          <Option value='' label='Choose text alignment' />
          <Option value='left' label='Left' />
          <Option value='center' label='Center' />
          <Option value='right' label='Right' />
        </Select>

        <ImageSelector
          selectedImages={formData.images}
          onImagesSelect={handleImagesSelect}
          multiple
          label={'Choose images'}
          showPreview
        />

        {formData.images && formData.images.length > 0 && (
          <div className='space-y-2.5'>
            {formData.images.length > 2 && (
              <Checkbox
                label='Set as carousel'
                id='isCarousel'
                name='isCarousel'
                defaultChecked={formData.isCarousel}
                onChange={handleInputChange}
              />
            )}
            <Checkbox
              label='Set column layout'
              id='isColumnLayout'
              name='isColumnLayout'
              defaultChecked={formData.isColumnLayout}
              onChange={handleInputChange}
            />
            {formData.isColumnLayout && (
              <Select
                label='Image position'
                id='imagePosition'
                name='imagePosition'
                value={formData.imagePosition}
                onChange={handleSelectChange}
              >
                <Option value='' label='Choose an image position' />
                <Option value='right' label='Right' />
                <Option value='left' label='Left' />
              </Select>
            )}
          </div>
        )}

        <Input
          label='YouTube video URL'
          id='videoUrl'
          name='videoUrl'
          value={formData.videoUrl}
          onChange={handleInputChange}
        />

        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}

        <div className='flex gap-2.5 lg:gap-5'>
          <Button
            type='submit'
            disabled={!formData.title.trim() || !formData.description.trim()}
            className='flex-1'
          >
            {prize ? 'Edit' : 'Create'}
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
}
