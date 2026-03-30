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
import { getSchedules } from '@/actions/supabase/cms-schema/schedules/getSchedules';
import { deleteSchedule } from '@/actions/supabase/cms-schema/schedules/deleteSchedule';
import {
  setVisibleSchedule,
  hideSchedule,
} from '@/actions/supabase/cms-schema/schedules/scheduleVisibility';
import { Schedule } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { ScheduleForm } from './SchedulesForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function SchedulesManager() {
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
  } = useCMSManager<Schedule>({
    fetchFn: getSchedules,
    deleteFn: deleteSchedule,
    deleteConfirmMessage:
      'Are you sure you want to delete this schedule section?',
    visibilityActions: { show: setVisibleSchedule, hide: hideSchedule },
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
            {'New Schedule'}
          </Button>
        )}
      </div>

      {/* Form for new/edit */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <ScheduleForm
            schedule={editingItem}
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
              {'No schedule sections found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create your first schedule section to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Schedule'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((schedule) => (
            <div
              key={schedule.id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid mb-2'
                    >
                      {schedule.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        <Paragraph>
                          {schedule.images.length}
                          {' images'}
                        </Paragraph>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaGripVertical className='h-4 w-4' />
                        <Paragraph>
                          {schedule.layout}
                          {' columns'}
                        </Paragraph>
                      </div>
                      {schedule.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />
                          {schedule.createdat}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            schedule.isvisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {schedule.isvisible ? 'Visible' : 'Hidden'}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleToggleVisibility(schedule)}
                    disabled={togglingVisibility === schedule.id || showForm}
                    className={`p-1 rounded ${
                      schedule.isvisible
                        ? 'text-humanoid'
                        : 'text-foreground/50'
                    }`}
                    title={schedule.isvisible ? 'Hide signup' : 'Show signup'}
                  >
                    {togglingVisibility === schedule.id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : schedule.isvisible ? (
                      <FaEye className='w-5 h-5' />
                    ) : (
                      <FaEyeSlash className='w-5 h-5' />
                    )}
                  </Button>

                  <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleEdit(schedule)}
                      disabled={showForm || togglingVisibility === schedule.id}
                      className='btn-link'
                      title='Edit schedule'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDelete(schedule.id)}
                      disabled={
                        deletingId === schedule.id ||
                        showForm ||
                        togglingVisibility === schedule.id
                      }
                      className='btn-link hover:text-red'
                      title='Delete schedule'
                    >
                      {deletingId === schedule.id ? (
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
