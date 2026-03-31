'use client';

import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaFolderPlus,
  FaEye,
  FaEyeSlash,
  FaVideo,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import { getAnnouncements } from '@/actions/supabase/cms-schema/announcements/getAnnouncements';
import { deleteAnnouncement } from '@/actions/supabase/cms-schema/announcements/deleteAnnouncement';
import {
  setVisibleAnnouncement,
  hideAnnouncement,
} from '@/actions/supabase/cms-schema/announcements/announcementVisibility';
import { Announcement } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { AnnouncementForm } from './AnnouncementForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function AnnouncementsManager() {
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
  } = useCMSManager<Announcement>({
    fetchFn: getAnnouncements,
    deleteFn: deleteAnnouncement,
    deleteConfirmMessage: 'Are you sure you want to delete this announcement?',
    visibilityActions: { show: setVisibleAnnouncement, hide: hideAnnouncement },
    exclusiveVisibility: true,
  });

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new prize button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Announcement'}
          </Button>
        )}
      </div>

      {/* Form for new/edit prize */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <AnnouncementForm
            announcement={editingItem}
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
              {'No announcements found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create you first announcement to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Announcement'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((announcement) => (
            <div
              key={announcement.id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid'
                    >
                      {announcement.title || 'No Title'}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      {announcement.mediatype === 'image' &&
                        announcement.image && (
                          <div className='flex items-center gap-1'>
                            <FaImage className='h-4 w-4' />
                            {'uses image'}
                          </div>
                        )}
                      {announcement.mediatype === 'video' &&
                        announcement.videourl && (
                          <div className='flex items-center gap-1'>
                            <FaVideo className='h-4 w-4' />
                            {'uses video'}
                          </div>
                        )}
                      {announcement.mediatype === 'none' && (
                        <div className='flex items-center gap-1'>
                          <Paragraph>{'Text only'}</Paragraph>
                        </div>
                      )}
                      {announcement.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {announcement.createdat}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            announcement.isvisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {announcement.isvisible ? 'Visible' : 'Hidden'}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleToggleVisibility(announcement)}
                    disabled={
                      togglingVisibility === announcement.id || showForm
                    }
                    className={`${
                      announcement.isvisible
                        ? 'text-humanoid'
                        : 'text-foreground/50'
                    }`}
                    title={
                      announcement.isvisible
                        ? 'Hide announcement'
                        : 'Show announcement'
                    }
                  >
                    {togglingVisibility === announcement.id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : announcement.isvisible ? (
                      <FaEye className='w-5 h-5' />
                    ) : (
                      <FaEyeSlash className='w-5 h-5' />
                    )}
                  </Button>

                  <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleEdit(announcement)}
                      disabled={
                        showForm || togglingVisibility === announcement.id
                      }
                      className='btn-link'
                      title='Edit Announcement'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDelete(announcement.id)}
                      disabled={
                        deletingId === announcement.id ||
                        showForm ||
                        togglingVisibility === announcement.id
                      }
                      className='btn-link hover:text-red'
                      title='Delete Announcement'
                    >
                      {deletingId === announcement.id ? (
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
