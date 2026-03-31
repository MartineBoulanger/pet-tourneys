'use client';

import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaFolderPlus,
} from 'react-icons/fa';
import { IoMdCalendar, IoMdLink } from 'react-icons/io';
import { getPartners } from '@/actions/supabase/cms-schema/partners/getPartners';
import { deletePartner } from '@/actions/supabase/cms-schema/partners/deletePartner';
import { Partner } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { PartnerForm } from './PartnersForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function PartnersManager() {
  const {
    items,
    loading,
    showForm,
    setShowForm,
    editingItem,
    deletingId,
    handleFormSuccess,
    handleEdit,
    handleCancelForm,
    handleDelete,
  } = useCMSManager<Partner>({
    fetchFn: getPartners,
    deleteFn: deletePartner,
    deleteConfirmMessage: 'Are you sure you want to delete this partner?',
  });

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Partner'}
          </Button>
        )}
      </div>

      {/* Form for new/edit */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <PartnerForm
            partner={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No partners found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create your first partner to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Partner'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((partner) => (
            <div
              key={partner.id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex-1'>
                    <Heading as='h3' className='font-bold text-humanoid'>
                      {partner.partner}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/50'>
                      <div className='flex items-center gap-1'>
                        <IoMdLink className='h-4 w-4' />
                        <span>{partner.link}</span>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        <Paragraph>
                          {partner.image ? '' : 'no'}
                          {' image'}
                        </Paragraph>
                      </div>
                      {partner.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />
                          {partner.createdat}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(partner)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit Partner'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDelete(partner.id)}
                    disabled={deletingId === partner.id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Signup'
                  >
                    {deletingId === partner.id ? (
                      <div className='h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <FaTrashAlt className='h-5 w-5' />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
