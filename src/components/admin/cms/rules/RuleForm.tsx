'use client';

import { useState } from 'react';
import { createRule, updateRule } from '@/mongoDB/actions/rules';
import { ImageUpload, Rule as RuleType } from '@/mongoDB/types';
import ImageSelector from '../ImageSelector';
import { Button, Heading, Input, RichTextEditor, Form } from '@/components/ui';

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
    imageIds: rule?.imageIds ?? [],
    createdAt: rule?.createdAt || new Date(),
    updatedAt: rule?.updatedAt || new Date(),
  });
  // const [title, setTitle] = useState<string>(rule?.title || '');
  // const [content, setContent] = useState<string>(rule?.content || '');
  // const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
  //   rule?.imageIds || []
  // );
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

    // const formData = new FormData();
    // formData.append('title', title);
    // formData.append('content', content);
    // selectedImageIds.forEach((imageId) => {
    //   formData.append('imageIds', imageId);
    // });

    try {
      let result;
      if (rule?._id) {
        result = await updateRule(rule._id, formData);
      } else {
        result = await createRule(formData);
      }

      if (result.success) {
        // setTitle('');
        // setContent('');
        // setSelectedImageIds([]);
        setFormData({
          _id: '',
          title: '',
          content: '',
          imageIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onSuccess?.();
      } else {
        setError(result.error || 'An unexpected error occurred');
      }

      // setTitle(title);
      // setContent(content);
    } catch (error) {
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
          selectedImageIds={formData.imageIds}
          onImagesSelect={(images) => {
            const imageIds = images.map((img) => img._id);
            setFormData((prev) => ({
              ...prev,
              imageIds,
            }));
          }}
          multiple
          maxSelection={30}
          label={'Choose images'}
          showPreview={true}
          allowNull={true}
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
