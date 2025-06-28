'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TournamentFormSkeleton, Form, Input } from '@/components/ui';
import {
  createTournament,
  updateTournament,
} from '@/supabase/actions/tournaments';
import { TournamentFormProps } from './types';

export function TournamentForm({ initialData = null }: TournamentFormProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    start_date:
      initialData?.start_date.slice(0, 16) ||
      new Date().toISOString().slice(0, 16),
    end_date: initialData
      ? initialData?.end_date?.slice(0, 16)
      : '1999-12-31 23:00:00',
    participant_count: initialData?.participant_count || 0,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Tournament name is required');
      return false;
    }
    if (!formData.start_date.trim()) {
      setError('Start Date is required');
      return false;
    }
    if (formData.participant_count < 0) {
      setError('Participant count must be positive');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submissionData = {
        name: formData.name,
        start_date: formData.start_date,
        end_date:
          formData.end_date !== '1999-12-31 23:00:00'
            ? formData.end_date
            : null,
        participant_count: formData.participant_count,
      };

      if (initialData?.id) {
        const { success } = await updateTournament(
          initialData.id,
          submissionData
        );
        if (!success) {
          toast.error('Failed to update!', {
            className: 'toast-error',
            description: 'Failed to update the tournament.',
          });
        }
        toast.success('Tournament updated successfully!', {
          className: 'toast-success',
          description: 'Tournament has been successfully updated.',
        });
      } else {
        const { success } = await createTournament(submissionData);
        if (!success) {
          toast.error('Failed to create!', {
            className: 'toast-error',
            description: 'Failed to create the tournament.',
          });
        }
        toast.success('Tournament created successfully!', {
          className: 'toast-success',
          description: 'Tournament has been successfully created.',
        });
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save!', {
        className: 'toast-error',
        description: 'Failed to save tournament',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return <TournamentFormSkeleton />;

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-2.5 lg:p-5'>
      <Form
        handleSubmit={handleSubmit}
        message={error}
        button1={{ variant: 'secondary', type: 'button', text: 'Cancel' }}
        button2={{
          variant: 'primary',
          type: 'submit',
          text: isSubmitting ? 'Saving...' : 'Save Tournament',
        }}
        handleClick={() => router.back()}
      >
        <Input
          type='text'
          id='name'
          name='name'
          label='Tournament Name'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Input
          type='datetime-local'
          id='start_date'
          name='start_date'
          label='Start Date'
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
          required
        />
        <div>
          <Input
            type='datetime-local'
            id='end_date'
            name='end_date'
            label='End Date'
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />
        </div>
        <Input
          type='number'
          id='participant_count'
          name='participant_count'
          label='Number of Participants'
          value={formData.participant_count}
          onChange={(e) =>
            setFormData({
              ...formData,
              participant_count: parseInt(e.target.value) || 0,
            })
          }
          min={0}
          required
        />
      </Form>
    </div>
  );
}
