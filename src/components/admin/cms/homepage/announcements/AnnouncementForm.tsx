'use client';

import { useState } from 'react';
import {
  createAnnouncement,
  updateAnnouncement,
} from '@/mongoDB/actions/announcements';
import { Announcement } from '@/mongoDB/types';
import { RichTextEditor } from '../../RichTextEditor';
import {
  Button,
  Input,
  Select,
  Option,
  Checkbox,
  Heading,
} from '@/components/ui';
import ImageSelector from '../../ImageSelector';

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AnnouncementForm({
  announcement,
  onSuccess,
  onCancel,
}: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    _id: announcement?._id || '',
    title: announcement?.title ?? '',
    description: announcement?.description ?? '',
    mediaType: announcement?.mediaType ?? 'none',
    imageId: announcement?.imageId ?? '',
    videoUrl: announcement?.videoUrl ?? '',
    isVisible: announcement?.isVisible ?? true,
    createdAt: announcement?.createdAt || new Date(),
    updatedAt: announcement?.updatedAt || new Date(),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let result;
      if (announcement?._id) {
        result = await updateAnnouncement(announcement._id, formData);
      } else {
        result = await createAnnouncement(formData);
      }
      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          description: '',
          mediaType: 'none',
          imageId: '',
          videoUrl: '',
          isVisible: true,
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
        {announcement ? 'Edit Announcement' : 'Create Announcement'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        <Input
          label='Title (optional)'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleInputChange}
        />

        <div>
          <label className='block mb-0.5'>{'Description (optional):'}</label>
          <RichTextEditor
            content={formData.description}
            onChange={handleDescriptionChange}
            className='min-h-[300px]'
          />
        </div>

        <Select
          label='Media type'
          id='mediaType'
          name='mediaType'
          value={formData.mediaType}
          onChange={handleSelectChange}
        >
          <Option value='none' label='No media' />
          <Option value='image' label='Image' />
          <Option value='video' label='Video' />
        </Select>

        {formData.mediaType === 'image' && (
          <ImageSelector
            selectedImageId={formData.imageId}
            onImageSelect={(image) => {
              setFormData((prev) => ({
                ...prev,
                imageId: String(image?._id),
              }));
            }}
            label={'Choose image'}
            showPreview={true}
            required
          />
        )}

        {formData.mediaType === 'video' && (
          <Input
            label='YouTube video URL'
            id='videoUrl'
            name='videoUrl'
            value={formData.videoUrl}
            onChange={handleInputChange}
            required
          />
        )}

        <Checkbox
          label='Make this section visible on homepage'
          id='isVisible'
          name='isVisible'
          defaultChecked={formData.isVisible}
          onChange={handleInputChange}
        />

        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}

        <div className='flex gap-2.5 lg:gap-5'>
          <Button type='submit' className='flex-1'>
            {announcement ? 'Edit' : 'Create'}
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
