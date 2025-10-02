'use client';

import { useState } from 'react';
import { FaTrashAlt, FaArrowUp, FaArrowDown, FaPlus } from 'react-icons/fa';
import { createPage, updatePage } from '@/features/cms/actions/pages';
import { Page, Section } from '@/features/cms/types';
import {
  Button,
  Heading,
  Input,
  Select,
  Option,
  Checkbox,
  Paragraph,
} from '@/components/ui';
import { RichTextEditor } from '../RichTextEditor';
import ImageSelector from '@/features/cloudinary/components/Selector';

interface PageFormProps {
  page?: Page;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PageForm({ page, onSuccess, onCancel }: PageFormProps) {
  const [formData, setFormData] = useState<Page>({
    _id: page?._id || '',
    title: page?.title ?? '',
    slug: page?.slug ?? '',
    type: page?.type ?? 'articles',
    bannerUrl: page?.bannerUrl ?? '',
    bannerType: page?.bannerType ?? 'none',
    sections: page?.sections ?? [],
    published: page?.published ?? false,
    createdAt: page?.createdAt || new Date(),
    updatedAt: page?.updatedAt || new Date(),
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const result = page?._id
        ? await updatePage(page._id, formData)
        : await createPage(formData);

      if (result.success) {
        setFormData({
          _id: '',
          title: '',
          slug: '',
          type: 'articles',
          bannerUrl: '',
          bannerImage: null,
          bannerType: 'none',
          sections: [],
          published: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to save page');
      }
    } catch (error) {
      console.error('Failed to save page:', error);
      setError('Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  const addSection = () => {
    const newSection: Section = {
      type: 'text',
      layout: 'full-width',
      text: '',
      textAlign: 'left',
      order: formData.sections.length + 1,
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const updatedSections = formData.sections.map((section, i) =>
      i === index ? { ...section, ...updates } : section
    );
    setFormData({ ...formData, sections: updatedSections });
  };

  const removeSection = (index: number) => {
    const updatedSections = formData.sections
      .filter((_, i) => i !== index)
      .map((section, i) => ({ ...section, order: i }));
    setFormData({ ...formData, sections: updatedSections });
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

    setFormData({ ...formData, sections: updatedSections });
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

          <Select
            label='Page Type'
            id='type'
            name='type'
            value={formData.type}
            onChange={handleSelectChange}
          >
            <Option value='articles' label='Article' />
            <Option value='guides' label='Guide' />
            <Option value='pet-reviews' label='Pet Review' />
          </Select>

          <Checkbox
            label='Publish page (only check this when the whole page has been finished creating/editing)'
            id='published'
            name='published'
            defaultChecked={formData.published}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Banner */}
      <div className='bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
          {'Page Banner (Optional)'}
        </Heading>

        <div className='space-y-4'>
          <Select
            label='Banner Type'
            id='bannerType'
            name='bannerType'
            value={formData.bannerType || 'none'}
            onChange={(e) =>
              setFormData({
                ...formData,
                bannerType:
                  (e.target.value as 'image' | 'video' | 'none') || 'none',
              })
            }
          >
            <Option value='none' label='No Banner' />
            <Option value='image' label='Image' />
            <Option value='video' label='Video' />
          </Select>

          {formData.bannerType === 'image' && (
            <ImageSelector
              selectedImage={formData.bannerImage}
              onImageSelect={(image) =>
                setFormData({ ...formData, bannerImage: image })
              }
              label={'Choose image'}
              showPreview={true}
              required
            />
          )}

          {formData.bannerType === 'video' && (
            <Input
              label='YouTube URL'
              name='bannerUrl'
              id='bannerUrl'
              value={formData.bannerUrl}
              onChange={handleInputChange}
              placeholder='https://youtu.be/bK05lhFY5l8?si=_lFr0LDpb7SOU65R'
            />
          )}
        </div>
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
                    <ImageSelector
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
      </div>

      {/* Submit Buttons */}
      <div className='flex gap-2.5 justify-end'>
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={loading}
        >
          {'Cancel'}
        </Button>
        <Button type='submit' disabled={loading}>
          {loading ? 'Saving...' : page?._id ? 'Update Page' : 'Create Page'}
        </Button>
      </div>
    </form>
  );
}
