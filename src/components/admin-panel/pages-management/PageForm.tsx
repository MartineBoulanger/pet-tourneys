'use client';

import { FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';
import { createPage } from '@/actions/supabase/cms-schema/pages/createPage';
import { updatePage } from '@/actions/supabase/cms-schema/pages/updatePage';
import { Page, Section } from '@/types/supabase.types';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
  Paragraph,
} from '@/components/ui';
import { RichTextEditor } from '@/components/layout/RichTextEditor';
import Selector from '@/components/cloudinary/Selector';
import { useCMSForm } from '@/hooks/useCMSForm';
import { PageFormProps } from '@/types/components.types';

export function PageForm({ page, type, onSuccess, onCancel }: PageFormProps) {
  const emptyData: Page = {
    id: '',
    title: '',
    slug: '',
    type,
    bannerimage: null,
    sections: [],
    author: null,
    ispublished: false,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleFieldChange,
    handleSubmit,
  } = useCMSForm<Page>({
    initialData: page ?? emptyData,
    emptyData,
    createFn: createPage,
    updateFn: updatePage,
    existingId: page?.id,
    validate: (data) => (!data.title?.trim() ? 'Title is required' : null),
    onSuccess,
  });

  const addSection = () => {
    const newSection: Section = {
      type: 'text',
      layout: 'full-width',
      text: '',
      textAlign: 'left',
      order: formData.sections.length + 1,
    };
    handleFieldChange('sections', [...formData.sections, newSection]);
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    handleFieldChange(
      'sections',
      formData.sections.map((section, i) =>
        i === index ? { ...section, ...updates } : section,
      ),
    );
  };

  const removeSection = (index: number) => {
    if (formData.sections.length <= 1) return;
    handleFieldChange(
      'sections',
      formData.sections
        .filter((_, i) => i !== index)
        .map((section, i) => ({ ...section, order: i })),
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.sections.length) return;

    const updatedSections = [...formData.sections];
    [updatedSections[index], updatedSections[newIndex]] = [
      updatedSections[newIndex],
      updatedSections[index],
    ];

    updatedSections.forEach((section, i) => {
      section.order = i;
    });

    handleFieldChange('sections', updatedSections);
  };

  const getSectionFields = (type: string) => {
    switch (type) {
      case 'text':
        return ['text'];
      case 'image':
        return ['imageUrl'];
      case 'video':
        return ['videoUrl'];
      case 'text-image':
        return ['text', 'imageUrl'];
      case 'text-video':
        return ['text', 'videoUrl'];
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2.5'>
      {/* Basic Info */}
      <div className='bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
          {'Basic Information'}
        </Heading>
        <div className='space-y-2.5'>
          <Input
            label='Page title'
            name='title'
            id='title'
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <Input
            label='Author'
            name='author'
            id='author'
            value={formData.author || ''}
            onChange={handleInputChange}
          />

          {/* the page type has to be given to the data, but because of the enum I cannot use the handleInputChange function */}
          <Input
            name='type'
            id='type'
            value={type}
            onChange={() => handleFieldChange('type', type)}
            className='hidden'
          />

          <Checkbox
            label='Publish page (only check this when the whole page has been finished)'
            id='ispublished'
            name='ispublished'
            defaultChecked={formData.ispublished ?? false}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Banner */}
      <div className='bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
          {'Page Banner Image (Optional)'}
        </Heading>
        <Selector
          selectedImage={formData.bannerimage}
          onImageSelect={(bannerimage) =>
            handleFieldChange('bannerimage', bannerimage)
          }
          label={'Choose banner image'}
          showPreview={true}
        />
      </div>

      {/* Sections */}
      <div className='bg-background rounded-lg p-2.5 lg:p-5'>
        <div className='flex justify-between items-center mb-2.5'>
          <Heading as='h3' className='text-xl text-humanoid'>
            {'Page Sections'}
          </Heading>
          <Button
            type='button'
            onClick={addSection}
            className='flex items-center gap-2'
          >
            <FaPlus className='h-4 w-4' />
            {'Add Section'}
          </Button>
        </div>

        {formData.sections.length === 0 ? (
          <Paragraph className='text-foreground/50 text-center py-5'>
            {'No sections yet. Click "Add Section" to create one.'}
          </Paragraph>
        ) : (
          <div className='space-y-4'>
            {formData.sections.map((section, index) => (
              <div key={index} className='rounded-lg p-4 bg-medium-grey'>
                <div className='flex justify-between items-start'>
                  <Heading as='h4' className='font-bold text-foreground'>
                    {'Section '}
                    {index + 1}
                  </Heading>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className='p-1'
                      title='Move Up'
                    >
                      <FaArrowUp className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === formData.sections.length - 1}
                      className='p-1'
                      title='Move Down'
                    >
                      <FaArrowDown className='h-4 w-4' />
                    </Button>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => removeSection(index)}
                      className='p-1 hover:text-red'
                      title='Remove Section'
                    >
                      <FaTrashAlt className='h-4 w-4' />
                    </Button>
                  </div>
                </div>

                <div className='space-y-2.5'>
                  <Select
                    label='Section Type'
                    id='type'
                    name='type'
                    value={section.type}
                    onChange={(e) =>
                      updateSection(index, {
                        type: e.target.value as
                          | 'text'
                          | 'image'
                          | 'video'
                          | 'text-image'
                          | 'text-video',
                      })
                    }
                  >
                    <Option value='text' label='Text Only' />
                    <Option value='image' label='Image Only' />
                    <Option value='video' label='Video Only' />
                    <Option value='text-image' label='Text + Image' />
                    <Option value='text-video' label='Text + Video' />
                  </Select>

                  {getSectionFields(section.type).includes('text') && (
                    <Select
                      label='Text Alignment'
                      id='textAlign'
                      name='textAlign'
                      value={section.textAlign || 'left'}
                      onChange={(e) =>
                        updateSection(index, {
                          textAlign: e.target.value as
                            | 'left'
                            | 'center'
                            | 'right',
                        })
                      }
                    >
                      <Option value='left' label='Left' />
                      <Option value='center' label='Center' />
                      <Option value='right' label='Right' />
                    </Select>
                  )}

                  {(section.type === 'text-image' ||
                    section.type === 'text-video') && (
                    <Select
                      label='Layout'
                      id='layout'
                      name='layout'
                      value={section.layout}
                      onChange={(e) =>
                        updateSection(index, {
                          layout: e.target.value as 'full-width' | 'two-column',
                        })
                      }
                    >
                      <Option value='full-width' label='Full Width' />
                      <Option value='two-column' label='Two Column' />
                    </Select>
                  )}

                  {getSectionFields(section.type).includes('text') && (
                    <div>
                      <label className='block mb-0.5'>{'Text Content:'}</label>
                      <RichTextEditor
                        content={section.text || ''}
                        onChange={(text) => updateSection(index, { text })}
                        className='min-h-[400px]'
                      />
                    </div>
                  )}

                  {getSectionFields(section.type).includes('imageUrl') && (
                    <Selector
                      selectedImage={section.image}
                      onImageSelect={(image) => updateSection(index, { image })}
                      label={'Choose image'}
                      showPreview={true}
                      required
                    />
                  )}

                  {getSectionFields(section.type).includes('videoUrl') && (
                    <Input
                      label='YouTube URL'
                      name='videoUrl'
                      id='videoUrl'
                      value={section.videoUrl || ''}
                      onChange={(e) =>
                        updateSection(index, { videoUrl: e.target.value })
                      }
                      placeholder='https://youtu.be/bK05lhFY5l8?si=_lFr0LDpb7SOU65R'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className='text-sm text-dark-red bg-light-red border-2 border-dark-red rounded-lg p-2.5'>
            {error}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className='flex gap-2.5 justify-end'>
        <Button type='button' variant='secondary' onClick={onCancel}>
          {'Cancel'}
        </Button>
        <Button type='submit'>{page ? 'Edit Page' : 'Create Page'}</Button>
      </div>
    </form>
  );
}
