'use client';

import { useState } from 'react';
import {
  FaPlus,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
  FaGripVertical,
} from 'react-icons/fa';
import { Schedule } from '@/features/cms/types';
import {
  createSchedule,
  updateSchedule,
} from '@/features/cms/actions/schedules';
import ImageSelector from '@/features/cloudinary/components/Selector';
import { CloudinaryImage } from '@/features/cloudinary/types';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
  Paragraph,
} from '@/components/ui';

interface ScheduleFormProps {
  schedule?: Schedule | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ScheduleForm({
  schedule,
  onSuccess,
  onCancel,
}: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    _id: schedule?._id || '',
    title: schedule?.title ?? '',
    images: schedule?.images ?? [],
    layout: schedule?.layout ?? '3',
    description: schedule?.description ?? '',
    isVisible: schedule?.isVisible ?? true,
    createdAt: schedule?.createdAt || new Date(),
    updatedAt: schedule?.updatedAt || new Date(),
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
            image: null,
            imageName: '',
            imageDate: '',
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
    field: keyof Schedule['images'][0],
    value: string | number | CloudinaryImage | null
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

  const handleImageSelect = (index: number, image: CloudinaryImage | null) => {
    updateImage(index, 'image', image);
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
      if (schedule?._id) {
        result = await updateSchedule(schedule._id, formData);
      } else {
        result = await createSchedule(formData);
      }

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          images: [],
          layout: '3',
          description: '',
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
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {schedule ? 'Edit Schedule' : 'Create Schedule'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
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
            <Paragraph className='block'>{'Schedule Items (Max 4)'}</Paragraph>
            <Button
              type='button'
              onClick={addImage}
              disabled={formData.images.length >= 4}
              className='flex items-center gap-2'
            >
              <FaPlus className='w-4 h-4' />
              {'Add Schedule Item'}
            </Button>
          </div>

          <div className='space-y-2.5'>
            {formData.images.map((image, index) => (
              <div
                key={`schedule-${index}`}
                className='p-2.5 rounded-lg bg-light-grey'
              >
                <div className='flex justify-between items-center mb-2.5'>
                  <Paragraph className='text-sm font-medium flex items-center gap-2.5'>
                    <FaGripVertical className='w-4 h-4 text-foreground/50' />
                    {'Schedule Item #'}
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
                    selectedImage={image.image}
                    onImageSelect={(selectedImage) =>
                      handleImageSelect(index, selectedImage)
                    }
                    required
                    showPreview
                  />

                  <Input
                    label='Schedule Item Title'
                    name='imageName'
                    id='imageName'
                    value={image.imageName}
                    onChange={(e) =>
                      updateImage(index, 'imageName', e.target.value)
                    }
                  />

                  <Input
                    label='Schedule Item Date'
                    name='imageDate'
                    id='imageDate'
                    placeholder='Write the date like "July 15th", or "T.B.D"'
                    value={image.imageDate}
                    onChange={(e) =>
                      updateImage(index, 'imageDate', e.target.value)
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
        <div className='flex justify-end gap-2.5'>
          {onCancel && (
            <Button type='button' variant='secondary' onClick={onCancel}>
              {'Cancel'}
            </Button>
          )}
          <Button type='submit'>{schedule ? 'Edit' : 'Create'}</Button>
        </div>
      </form>
    </div>
  );
}
