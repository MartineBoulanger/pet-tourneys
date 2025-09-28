'use client';

import { useState, useEffect } from 'react';
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
import {
  getAnnouncements,
  deleteAnnouncement,
  setVisibleAnnouncement,
  hideAnnouncement,
} from '@/features/cms/actions/announcements';
import { Announcement } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { AnnouncementForm } from './AnnouncementForm';

export function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState<string | null>(
    null
  );
  const [editingAnnouncement, setEditingAnnouncement] = useState<
    Announcement | undefined
  >();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const result = await getAnnouncements();
      if (result) {
        setAnnouncements(result || []);
      } else {
        console.error('Error loading announcements');
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAnnouncement(undefined);
    loadAnnouncements();
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleDeleteRule = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    setDeletingId(announcementId);
    try {
      const result = await deleteAnnouncement(announcementId);
      if (result.success) {
        await loadAnnouncements();
      } else {
        alert(result.error || 'Error during deleting');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (announcement: Announcement) => {
    setTogglingVisibility(announcement._id);
    try {
      let result;

      if (announcement.isVisible) {
        // Als het announcement currently visible is, hide het
        result = await hideAnnouncement(announcement._id);

        if (result.success) {
          setAnnouncements((prevAnnouncements) =>
            prevAnnouncements.map((a) =>
              a._id === announcement._id ? { ...a, isVisible: false } : a
            )
          );
        }
      } else {
        // Als het announcement currently hidden is, make het visible (en hide alle anderen)
        result = await setVisibleAnnouncement(announcement._id);

        if (result.success) {
          setAnnouncements((prevAnnouncements) =>
            prevAnnouncements.map((a) => ({
              ...a,
              isVisible: a._id === announcement._id,
            }))
          );
        }
      }

      if (!result.success) {
        alert(result.error || 'Error updating visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('An unexpected error occurred');
    } finally {
      setTogglingVisibility(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAnnouncement(undefined);
  };

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
            announcement={editingAnnouncement}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {announcements.length === 0 ? (
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
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
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
                      {announcement.mediaType === 'image' &&
                        announcement.image && (
                          <div className='flex items-center gap-1'>
                            <FaImage className='h-4 w-4' />
                            {'uses image'}
                          </div>
                        )}
                      {announcement.mediaType === 'video' &&
                        announcement.videoUrl && (
                          <div className='flex items-center gap-1'>
                            <FaVideo className='h-4 w-4' />
                            {'uses video'}
                          </div>
                        )}
                      {announcement.mediaType === 'none' && (
                        <div className='flex items-center gap-1'>
                          <Paragraph>{'Text only'}</Paragraph>
                        </div>
                      )}
                      {announcement.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            announcement.isVisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {announcement.isVisible ? 'Visible' : 'Hidden'}
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
                      togglingVisibility === announcement._id || showForm
                    }
                    className={`${
                      announcement.isVisible
                        ? 'text-humanoid'
                        : 'text-foreground/50'
                    }`}
                    title={
                      announcement.isVisible
                        ? 'Hide announcement'
                        : 'Show announcement'
                    }
                  >
                    {togglingVisibility === announcement._id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : announcement.isVisible ? (
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
                        showForm || togglingVisibility === announcement._id
                      }
                      className='btn-link'
                      title='Edit Announcement'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDeleteRule(announcement._id)}
                      disabled={
                        deletingId === announcement._id ||
                        showForm ||
                        togglingVisibility === announcement._id
                      }
                      className='btn-link hover:text-red'
                      title='Delete Announcement'
                    >
                      {deletingId === announcement._id ? (
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
