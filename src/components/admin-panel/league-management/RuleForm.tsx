'use client';

import { createRule } from '@/actions/supabase/cms-schema/rules/createRule';
import { updateRule } from '@/actions/supabase/cms-schema/rules/updateRule';
import { Rule } from '@/types/supabase.types';
import Selector from '@/components/cloudinary/Selector';
import { Button, Heading, Input } from '@/components/ui';
import { RichTextEditor } from '@/components/layout/RichTextEditor';
import { useCMSForm } from '@/hooks/useCMSForm';
import { RuleFormProps } from '@/types/components.types';

export function RuleForm({ rule, onSuccess, onCancel }: RuleFormProps) {
  const emptyData: Rule = {
    id: '',
    title: '',
    content: '',
    images: [],
    index: 1,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleFieldChange,
    handleSubmit,
  } = useCMSForm<Rule>({
    initialData: rule ?? emptyData,
    emptyData,
    createFn: createRule,
    updateFn: updateRule,
    existingId: rule?.id,
    validate: (data) =>
      !data.title?.trim() || !data.content?.trim()
        ? 'Title, and content are required'
        : null,
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {rule ? `Edit ${formData.title}` : 'Create New Rule'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
        <Input
          label='Rule title'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleInputChange}
        />

        <div>
          <label className='block mb-0.5'>{'Rule Content:'}</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => handleFieldChange('content', content)}
            className='min-h-[400px]'
          />
        </div>

        <Selector
          selectedImages={formData.images}
          onImagesSelect={(images) => handleFieldChange('images', images)}
          multiple
          label={'Choose images'}
          showPreview
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
            disabled={!formData.title.trim() || !formData.content.trim()}
          >
            {rule ? 'Edit Rule' : 'Create Rule'}
          </Button>
        </div>
      </form>
    </div>
  );
}
