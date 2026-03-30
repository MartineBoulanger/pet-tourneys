'use client';

import {
  FaPlus,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
  FaGripVertical,
} from 'react-icons/fa';
import { Signup } from '@/types/supabase.types';
import { createSignup } from '@/actions/supabase/cms-schema/signups/createSignup';
import { updateSignup } from '@/actions/supabase/cms-schema/signups/updateSignup';
import Selector from '@/components/cloudinary/Selector';
import { CloudinaryImage } from '@/types/cloudinary.types';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
  Paragraph,
} from '@/components/ui';
import { useCMSForm } from '@/hooks/useCMSForm';
import { SignupFormProps } from '@/types/components.types';

export function SignupForm({ signup, onSuccess, onCancel }: SignupFormProps) {
  const emptyData: Signup = {
    id: '',
    title: '',
    images: [],
    layout: '3',
    isvisible: true,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleSelectChange,
    handleFieldChange,
    handleSubmit,
  } = useCMSForm<Signup>({
    initialData: signup ?? emptyData,
    emptyData,
    createFn: createSignup,
    updateFn: updateSignup,
    existingId: signup?.id,
    validate: (data) => (!data.title?.trim() ? 'Title is required' : null),
    onSuccess,
  });

  const addImage = () => {
    if (formData.images.length >= 4) return;
    handleFieldChange('images', [
      ...formData.images,
      {
        image: null,
        imageName: '',
        imageAlt: '',
        signupUrl: '',
        order: formData.images.length + 1,
      },
    ]);
  };

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) return;
    handleFieldChange(
      'images',
      formData.images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i + 1 })),
    );
  };

  const updateImage = (
    index: number,
    field: keyof Signup['images'][0],
    value: string | number | CloudinaryImage | null,
  ) => {
    handleFieldChange(
      'images',
      formData.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img,
      ),
    );
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === formData.images.length - 1)
    ) {
      return;
    }
    const newImages = [...formData.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];
    handleFieldChange(
      'images',
      newImages.map((img, i) => ({ ...img, order: i + 1 })),
    );
  };

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {signup ? `Edit ${formData.title}` : 'Create New Signup'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
        {/* Title */}
        <Input
          label='Title'
          name='title'
          id='title'
          value={formData.title || ''}
          onChange={handleInputChange}
          required
        />

        {/* Layout */}
        <Select
          label='Layout'
          id='layout'
          name='layout'
          value={formData.layout}
          onChange={handleSelectChange}
        >
          <Option value='2' label='2 Columns' />
          <Option value='3' label='3 Columns' />
          <Option value='4' label='4 Columns' />
        </Select>

        {/* Images */}
        <div>
          <div className='flex justify-between items-center mb-2.5'>
            <Paragraph className='block'>{'Signup Items (Max 4)'}</Paragraph>
            <Button
              type='button'
              onClick={addImage}
              disabled={formData.images.length >= 4}
              className='flex items-center gap-2'
            >
              <FaPlus className='w-4 h-4' />
              {'Add Signup Item'}
            </Button>
          </div>

          <div className='space-y-2.5'>
            {formData.images.map((image, index) => (
              <div
                key={`signup-${index}`}
                className='p-2.5 rounded-lg bg-light-grey'
              >
                <div className='flex justify-between items-center mb-2.5'>
                  <Paragraph className='text-sm font-medium flex items-center gap-2.5'>
                    <FaGripVertical className='w-4 h-4 text-foreground/50' />
                    {'Signup Item #'}
                    {index + 1}
                  </Paragraph>
                  <div className='flex gap-2.5'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className='disabled:opacity-20 disabled:cursor-not-allowed'
                    >
                      <FaArrowUp className='w-5 h-5' />
                    </Button>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === formData.images.length - 1}
                      className='disabled:opacity-20 disabled:cursor-not-allowed'
                    >
                      <FaArrowDown className='w-5 h-5' />
                    </Button>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => removeImage(index)}
                      disabled={formData.images.length <= 1}
                      className='hover:text-red disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <FaTrashAlt className='w-5 h-5' />
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-2.5 p-2.5 bg-background rounded-lg'>
                  <Selector
                    label='Select Image'
                    selectedImage={image.image}
                    onImageSelect={(selectedImage) =>
                      updateImage(index, 'image', selectedImage)
                    }
                    required
                    showPreview
                  />

                  <Input
                    label='Region Name'
                    name='imageName'
                    id='imageName'
                    value={image.imageName}
                    onChange={(e) =>
                      updateImage(index, 'imageName', e.target.value)
                    }
                    required
                  />

                  <Input
                    type='url'
                    label='Signup URL'
                    name='signupUrl'
                    id='signupUrl'
                    value={image.signupUrl}
                    onChange={(e) =>
                      updateImage(index, 'signupUrl', e.target.value)
                    }
                  />

                  <Input
                    label='Alt Text'
                    name='imageAlt'
                    id='imageAlt'
                    value={image.imageAlt}
                    onChange={(e) =>
                      updateImage(index, 'imageAlt', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility */}
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

        {/* Form Actions */}
        <div className='flex justify-end gap-2.5'>
          {onCancel && (
            <Button type='button' variant='secondary' onClick={onCancel}>
              {'Cancel'}
            </Button>
          )}
          <Button type='submit'>
            {signup ? 'Edit Signup' : 'Create Signup'}
          </Button>
        </div>
      </form>
    </div>
  );
}
