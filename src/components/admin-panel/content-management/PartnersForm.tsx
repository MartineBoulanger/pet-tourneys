'use client';

import { createPartner } from '@/actions/supabase/cms-schema/partners/createPartner';
import { updatePartner } from '@/actions/supabase/cms-schema/partners/updatePartner';
import Selector from '@/components/cloudinary/Selector';
import { Button, Heading, Input } from '@/components/ui';
import { Partner } from '@/types/supabase.types';
import { PartnerFormProps } from '@/types/components.types';
import { useCMSForm } from '@/hooks/useCMSForm';

export function PartnerForm({
  partner,
  onSuccess,
  onCancel,
}: PartnerFormProps) {
  const emptyData: Partner = {
    id: '',
    partner: '',
    link: '',
    image: null,
    createdat: new Date().toISOString(),
    updatedat: new Date().toISOString(),
  };

  const {
    formData,
    error,
    handleInputChange,
    handleFieldChange,
    handleSubmit,
  } = useCMSForm<Partner>({
    initialData: partner ?? emptyData,
    emptyData,
    createFn: createPartner,
    updateFn: updatePartner,
    existingId: partner?.id,
    validate: (data) =>
      !data.partner?.trim() || !data.link?.trim() || !data.image
        ? 'Partner name, partner link, and partner image are required'
        : null,
    onSuccess,
  });

  return (
    <div className='bg-background rounded-lg p-2.5 lg:p-5'>
      <Heading as='h3' className='text-xl text-humanoid mb-2.5'>
        {partner ? `Edit ${formData.partner}` : 'Create New Partner'}
      </Heading>

      <form onSubmit={handleSubmit} className='space-y-2.5'>
        {/* Title */}
        <Input
          label='Partner Name'
          name='partner'
          id='partner'
          value={formData.partner}
          onChange={handleInputChange}
          required
        />

        {/* Link */}
        <Input
          label='Partner Link'
          name='link'
          id='link'
          value={formData.link}
          onChange={handleInputChange}
          required
        />

        {/* Image */}
        <Selector
          label='Select Image'
          selectedImage={formData.image}
          onImageSelect={(image) => handleFieldChange('image', image)}
          required
          showPreview
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
            {partner ? 'Edit Partner' : 'Create Partner'}
          </Button>
        </div>
      </form>
    </div>
  );
}
