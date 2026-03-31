'use client';

import { createAnnouncement } from '@/actions/supabase/cms-schema/announcements/createAnnouncement';
import { updateAnnouncement } from '@/actions/supabase/cms-schema/announcements/updateAnnouncement';
import { AnnouncementFormProps } from '@/types/components.types';
import { Announcement } from '@/types/supabase.types';
import { RichTextEditor } from '@/components/layout/RichTextEditor';
import Selector from '@/components/cloudinary/Selector';
import {
  Button,
  Input,
  Select,
  Option,
  Checkbox,
  Heading,
} from '@/components/ui';
import { useCMSForm } from '@/hooks/useCMSForm';

export function AnnouncementForm({
  announcement,
  onSuccess,
  onCancel,
}: AnnouncementFormProps) {
  const emptyData: Announcement = {
    id: '',
    title: '',
    description: '',
    mediatype: 'none',
    image: null,
    videourl: '',
    isvisible: true,
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
  } = useCMSForm<Announcement>({
    initialData: announcement ?? emptyData,
    emptyData,
    createFn: createAnnouncement,
    updateFn: updateAnnouncement,
    existingId: announcement?.id,
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {announcement
          ? `Edit ${!formData.title?.trim() ? 'Announcement' : formData.title}`
          : 'Create New Announcement'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
        <Input
          label='Title (optional)'
          name='title'
          id='title'
          value={formData.title || ''}
          onChange={handleInputChange}
        />

        <div>
          <label className='block mb-0.5'>{'Description (optional):'}</label>
          <RichTextEditor
            content={formData.description || ''}
            onChange={(description) =>
              handleFieldChange('description', description)
            }
            className='min-h-[300px]'
          />
        </div>

        <Select
          label='Media type'
          id='mediatype'
          name='mediatype'
          value={formData.mediatype}
          onChange={handleSelectChange}
        >
          <Option value='none' label='No media' />
          <Option value='image' label='Image' />
          <Option value='video' label='Video' />
        </Select>

        {formData.mediatype === 'image' && (
          <Selector
            selectedImage={formData.image}
            onImageSelect={(image) => handleFieldChange('image', image)}
            label={'Choose image'}
            showPreview={true}
            required
          />
        )}

        {formData.mediatype === 'video' && (
          <Input
            label='YouTube video URL'
            id='videourl'
            name='videourl'
            value={formData.videourl || ''}
            onChange={handleInputChange}
            required
          />
        )}

        <Checkbox
          label='Make this section visible on homepage'
          id='isvisible'
          name='isvisible'
          defaultChecked={formData.isvisible ?? false}
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
          <Button type='submit'>
            {announcement ? 'Edit Announcement' : 'Create Announcement'}
          </Button>
        </div>
      </form>
    </div>
  );
}
