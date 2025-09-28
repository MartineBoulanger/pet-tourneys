'use client';

import { useState } from 'react';
import {
  createAnnouncement,
  updateAnnouncement,
} from '@/features/cms/actions/announcements';
import { Announcement } from '@/features/cms/types';
import { RichTextEditor } from '@/features/cms/components/RichTextEditor';
import ImageSelector from '@/features/cloudinary/components/Selector';
import { CloudinaryImage } from '@/features/cloudinary/types';
import {
  Button,
  Input,
  Select,
  Option,
  Checkbox,
  Heading,
} from '@/components/ui';

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
    image: announcement?.image ?? null,
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
      // Clear image when media type changes
      image: value !== 'image' ? null : prev.image,
      videoUrl: value !== 'video' ? '' : prev.videoUrl,
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setFormData((prev) => ({
      ...prev,
      description,
    }));
  };

  const handleImageSelect = (image: CloudinaryImage | null) => {
    setFormData((prev) => ({
      ...prev,
      image: image,
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
          image: null,
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
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {announcement ? 'Edit Announcement' : 'Create Announcement'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
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
            selectedImage={formData.image}
            onImageSelect={handleImageSelect}
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

        <div className='flex justify-end gap-2.5'>
          {onCancel && (
            <Button type='button' variant='secondary' onClick={onCancel}>
              {'Cancel'}
            </Button>
          )}
          <Button type='submit'>{announcement ? 'Edit' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
}
