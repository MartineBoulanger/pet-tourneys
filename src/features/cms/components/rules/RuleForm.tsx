'use client';

import { useState } from 'react';
import { createRule, updateRule } from '@/features/cms/actions/rules';
import { Rule as RuleType } from '@/features/cms/types';
import ImageSelector from '@/features/cloudinary/components/Selector';
import { CloudinaryImage } from '@/features/cloudinary/types';
import { Button, Heading, Input } from '@/components/ui';
import { RichTextEditor } from '../RichTextEditor';

interface RuleFormProps {
  rule?: RuleType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RuleForm({ rule, onSuccess, onCancel }: RuleFormProps) {
  const [formData, setFormData] = useState<RuleType>({
    _id: rule?._id || '',
    title: rule?.title ?? '',
    content: rule?.content ?? '',
    images: rule?.images ?? [],
    createdAt: rule?.createdAt || new Date(),
    updatedAt: rule?.updatedAt || new Date(),
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
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
    } else if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      let result;
      if (rule?._id) {
        result = await updateRule(rule._id, formData);
      } else {
        result = await createRule(formData);
      }

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          content: '',
          images: [],
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
        {rule ? 'Edit Rule' : 'Create Rule'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5 lg:space-y-5'>
        <Input
          label='Rule title'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleChange}
        />

        <div>
          <label className='block mb-0.5'>{'Rule Content:'}</label>
          <RichTextEditor
            content={formData.content}
            onChange={handleContentChange}
            className='min-h-[400px]'
          />
        </div>

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
            disabled={!formData.title.trim() || !formData.content.trim()}
            className='flex-1'
          >
            {rule ? 'Edit' : 'Create'}
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
