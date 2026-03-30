'use client';

import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaFolderPlus,
  FaEye,
  FaEyeSlash,
  FaGripVertical,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import { getSignups } from '@/actions/supabase/cms-schema/signups/getSignups';
import { deleteSignup } from '@/actions/supabase/cms-schema/signups/deleteSignup';
import {
  setVisibleSignup,
  hideSignup,
} from '@/actions/supabase/cms-schema/signups/signupVisibility';
import { Signup } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { SignupForm } from './SignupsForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function SignupsManager() {
  const {
    items,
    loading,
    showForm,
    setShowForm,
    editingItem,
    deletingId,
    togglingVisibility,
    handleFormSuccess,
    handleEdit,
    handleCancelForm,
    handleDelete,
    handleToggleVisibility,
  } = useCMSManager<Signup>({
    fetchFn: getSignups,
    deleteFn: deleteSignup,
    deleteConfirmMessage:
      'Are you sure you want to delete this signup section?',
    visibilityActions: { show: setVisibleSignup, hide: hideSignup },
    exclusiveVisibility: true,
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
            {'New Signup'}
          </Button>
        )}
      </div>

      {/* Form for new/edit */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <SignupForm
            signup={editingItem}
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
              {'No signup sections found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create your first signup section to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Signup Section'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((signup) => (
            <div
              key={signup.id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid mb-2'
                    >
                      {signup.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        <Paragraph>
                          {signup.images.length}
                          {' images'}
                        </Paragraph>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaGripVertical className='h-4 w-4' />
                        <Paragraph>
                          {signup.layout}
                          {' columns'}
                        </Paragraph>
                      </div>
                      {signup.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />
                          {signup.createdat}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            signup.isvisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {signup.isvisible ? 'Visible' : 'Hidden'}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleToggleVisibility(signup)}
                    disabled={togglingVisibility === signup.id || showForm}
                    className={`p-1 rounded ${
                      signup.isvisible ? 'text-humanoid' : 'text-foreground/50'
                    }`}
                    title={signup.isvisible ? 'Hide signup' : 'Show signup'}
                  >
                    {togglingVisibility === signup.id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : signup.isvisible ? (
                      <FaEye className='w-5 h-5' />
                    ) : (
                      <FaEyeSlash className='w-5 h-5' />
                    )}
                  </Button>

                  <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleEdit(signup)}
                      disabled={showForm || togglingVisibility === signup.id}
                      className='btn-link'
                      title='Edit Signup'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDelete(signup.id)}
                      disabled={
                        deletingId === signup.id ||
                        showForm ||
                        togglingVisibility === signup.id
                      }
                      className='btn-link hover:text-red'
                      title='Delete Signup'
                    >
                      {deletingId === signup.id ? (
                        <div className='h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <FaTrashAlt className='h-5 w-5' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
