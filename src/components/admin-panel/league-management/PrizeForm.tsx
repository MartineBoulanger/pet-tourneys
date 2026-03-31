'use client';

import { createPrize } from '@/actions/supabase/cms-schema/prizes/createPrize';
import { updatePrize } from '@/actions/supabase/cms-schema/prizes/updatePrize';
import { Prize } from '@/types/supabase.types';
import Selector from '@/components/cloudinary/Selector';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
} from '@/components/ui';
import { RichTextEditor } from '@/components/layout/RichTextEditor';
import { useCMSForm } from '@/hooks/useCMSForm';
import { PrizeFormProps } from '@/types/components.types';

export function PrizeForm({ prize, onSuccess, onCancel }: PrizeFormProps) {
  const emptyData: Prize = {
    id: '',
    title: '',
    description: '',
    iscarousel: false,
    iscolumnlayout: false,
    imageposition: 'bottom',
    textalignment: 'left',
    images: [],
    videourl: '',
    index: 1,
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
  } = useCMSForm<Prize>({
    initialData: prize ?? emptyData,
    emptyData,
    createFn: createPrize,
    updateFn: updatePrize,
    existingId: prize?.id,
    validate: (data) =>
      !data.title?.trim() || !data.description?.trim()
        ? 'Title, and description are required'
        : null,
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {prize ? `Edit ${formData.title}` : 'Create New Prize'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
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
            content={formData.description || ''}
            onChange={(description) =>
              handleFieldChange('description', description)
            }
            className='min-h-[400px]'
          />
        </div>

        <Select
          label='Text alignment'
          id='textalignment'
          name='textalignment'
          value={formData.textalignment}
          onChange={handleSelectChange}
        >
          <Option value='left' label='Left' />
          <Option value='center' label='Center' />
          <Option value='right' label='Right' />
        </Select>

        <Selector
          selectedImages={formData.images}
          onImagesSelect={(images) => handleFieldChange('images', images)}
          multiple
          label={'Choose images'}
          showPreview
        />

        {formData.images && formData.images.length > 0 && (
          <div className='space-y-2.5'>
            {formData.images.length > 2 && (
              <Checkbox
                label='Set as carousel'
                id='iscarousel'
                name='iscarousel'
                defaultChecked={formData.iscarousel ?? false}
                onChange={handleInputChange}
              />
            )}
            <Checkbox
              label='Set column layout'
              id='iscolumnlayout'
              name='iscolumnlayout'
              defaultChecked={formData.iscolumnlayout ?? false}
              onChange={handleInputChange}
            />
            {formData.iscolumnlayout && (
              <Select
                label='Image position'
                id='imageposition'
                name='imageposition'
                value={formData.imageposition || ''}
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
          id='videourl'
          name='videourl'
          value={formData.videourl || ''}
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
          <Button
            type='submit'
            disabled={!formData.title.trim() || !formData.description?.trim()}
          >
            {prize ? 'Edit Prize' : 'Create Prize'}
          </Button>
        </div>
      </form>
    </div>
  );
}
