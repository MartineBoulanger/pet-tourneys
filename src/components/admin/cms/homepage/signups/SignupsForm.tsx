'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
  FaGripVertical,
} from 'react-icons/fa';
import { Signup } from '@/mongoDB/types';
import { createSignup, updateSignup } from '@/mongoDB/actions/signups';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
  Paragraph,
} from '@/components/ui';
import ImageSelector from '../../ImageSelector';

interface SignupFormProps {
  signup?: Signup;
  onSuccess: () => void;
  onCancel: () => void;
}

export function SignupForm({ signup, onSuccess, onCancel }: SignupFormProps) {
  const [formData, setFormData] = useState({
    _id: signup?._id || '',
    title: signup?.title ?? '',
    images: signup?.images ?? [],
    layout: signup?.layout ?? '3',
    isVisible: signup?.isVisible ?? true,
    createdAt: signup?.createdAt || new Date(),
    updatedAt: signup?.updatedAt || new Date(),
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

  const addImage = () => {
    if (formData.images.length < 4) {
      setFormData({
        ...formData,
        images: [
          ...formData.images,
          {
            imageId: '',
            imageName: '',
            imageAlt: '',
            signupUrl: '',
            order: formData.images.length + 1,
          },
        ],
      });
    }
  };

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) return;

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.map((img, i) => ({ ...img, order: i + 1 })),
    });
  };

  const updateImage = (
    index: number,
    field: keyof Signup['images'][0],
    value: string | number
  ) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
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

    setFormData({
      ...formData,
      images: newImages.map((img, i) => ({ ...img, order: i + 1 })),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      let result;
      if (signup?._id) {
        result = await updateSignup(signup._id, formData);
      } else {
        result = await createSignup(formData);
      }

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          images: [],
          layout: '3',
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid font-medium mb-2.5'>
        {signup ? 'Edit Signup' : 'Create Signup'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        {/* Title */}
        <Input
          label='Title'
          name='title'
          id='title'
          value={formData.title}
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
          <Option value='' label='Choose number of columns' />
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
                className='p-5 rounded-lg bg-light-grey'
              >
                <div className='flex justify-between items-center mb-2.5'>
                  <Paragraph className='text-sm font-medium flex items-center gap-2'>
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
                  <ImageSelector
                    label='Select Image'
                    selectedImageId={image.imageId}
                    onImageSelect={(selectedImage) => {
                      updateImage(
                        index,
                        'imageId',
                        selectedImage ? selectedImage._id : ''
                      );
                    }}
                    required={true}
                    allowNull={false}
                    showPreview={true}
                    placeholder='Choose an image for this signup item...'
                    className='mb-2.5'
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
                    required
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

        {/* Form Actions */}
        <div className='flex gap-2.5 lg:gap-5'>
          <Button type='submit' className='flex-1'>
            {signup ? 'Edit' : 'Create'}
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
