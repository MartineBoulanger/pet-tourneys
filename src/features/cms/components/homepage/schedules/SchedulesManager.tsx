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
  FaGripVertical,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import {
  getSchedules,
  deleteSchedule,
  setVisibleSchedule,
  hideSchedule,
} from '@/features/cms/actions/schedules';
import { Schedule } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { ScheduleForm } from './SchedulesForm';

export function SchedulesManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState<string | null>(
    null
  );
  const [editingSchedule, setEditingSchedule] = useState<
    Schedule | undefined
  >();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      const result = await getSchedules();
      if (result.success) {
        setSchedules(result.schedules || []);
      } else {
        console.error('Error loading schedules:', result.error);
        setSchedules([]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSchedule(undefined);
    loadSchedules();
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to delete this schedule section?')) {
      return;
    }

    setDeletingId(scheduleId);
    try {
      const result = await deleteSchedule(scheduleId);
      if (result.success) {
        await loadSchedules();
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

  const handleToggleVisibility = async (schedule: Schedule) => {
    setTogglingVisibility(schedule._id);
    try {
      let result;

      if (schedule.isVisible) {
        result = await hideSchedule(schedule._id);

        if (result.success) {
          setSchedules((prevSchedules) =>
            prevSchedules.map((s) =>
              s._id === schedule._id ? { ...s, isVisible: false } : s
            )
          );
        }
      } else {
        result = await setVisibleSchedule(schedule._id);

        if (result.success) {
          setSchedules((prevSchedules) =>
            prevSchedules.map((s) => ({
              ...s,
              isVisible: s._id === schedule._id,
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
    setEditingSchedule(undefined);
  };

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
            schedule={editingSchedule}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {schedules.length === 0 ? (
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
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
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
                      {schedule.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />
                          {new Date(schedule.createdAt).toLocaleDateString()}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            schedule.isVisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {schedule.isVisible ? 'Visible' : 'Hidden'}
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
                    disabled={togglingVisibility === schedule._id || showForm}
                    className={`p-1 rounded ${
                      schedule.isVisible
                        ? 'text-humanoid'
                        : 'text-foreground/50'
                    }`}
                    title={schedule.isVisible ? 'Hide signup' : 'Show signup'}
                  >
                    {togglingVisibility === schedule._id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : schedule.isVisible ? (
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
                      disabled={showForm || togglingVisibility === schedule._id}
                      className='btn-link'
                      title='Edit schedule'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDelete(schedule._id)}
                      disabled={
                        deletingId === schedule._id ||
                        showForm ||
                        togglingVisibility === schedule._id
                      }
                      className='btn-link hover:text-red'
                      title='Delete schedule'
                    >
                      {deletingId === schedule._id ? (
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
