'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadBattleLog } from '@/supabase/actions/uploadLogs';
import { updateMatchWithLogs } from '@/supabase/actions/matches';
import {
  Form,
  Input,
  UploadFormSkeleton,
  Heading,
  Paragraph,
} from '@/components/ui';
import { UploadFormProps } from '@/types';

export function UploadForm({
  tournaments,
  initialData,
  match_id = '',
  isEditMode = false,
}: UploadFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    player1: initialData?.player1 || '',
    player2: initialData?.player2 || '',
    owner: initialData?.owner || '',
    date: initialData?.date || new Date().toISOString().slice(0, 16),
    logs: initialData?.logs || '',
    petUsage: initialData?.petUsage || '',
    tournament_id: initialData?.tournament_id || '',
    region: initialData?.region || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const result = isEditMode
        ? await updateMatchWithLogs(formData.tournament_id, match_id, {
            matchUpdates: {
              player1: formData.player1,
              player2: formData.player2,
              owner: formData.owner,
              date: formData.date,
              region: formData.region,
            },
            newLogsText: formData.logs,
            newPetUsageText: formData.petUsage,
          })
        : await uploadBattleLog({
            player1: formData.player1,
            player2: formData.player2,
            owner: formData.owner,
            date: formData.date,
            logs: formData.logs,
            petUsage: formData.petUsage,
            tournament_id: formData.tournament_id,
            region: formData.region,
          });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        player1: '',
        player2: '',
        owner: '',
        date: new Date().toISOString().slice(0, 16),
        logs: '',
        petUsage: '',
        tournament_id: '',
        region: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to upload logs'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonText = isEditMode
    ? isSubmitting
      ? 'Updating...'
      : 'Update Match'
    : isSubmitting
    ? 'Uploading...'
    : 'Upload Logs';

  if (!isMounted) return <UploadFormSkeleton />;

  return (
    <div className='bg-light-grey shadow-md rounded-lg p-5'>
      {submitError && (
        <div className='rounded-md bg-red-50 p-4 mb-5'>
          <div className='flex'>
            <div className='ml-3'>
              <Heading as='h3' className='text-sm font-medium text-red-800'>
                {'Error'}
              </Heading>
              <div className='mt-2 text-sm text-red-700'>
                <Paragraph>{submitError}</Paragraph>
              </div>
            </div>
          </div>
        </div>
      )}
      {submitSuccess && (
        <div className='rounded-md bg-green-50 p-4 mb-5'>
          <div className='flex'>
            <div className='ml-3'>
              <Heading as='h3' className='text-sm font-medium text-green-800'>
                {'Success'}
              </Heading>
              <div className='mt-2 text-sm text-green-700'>
                <Paragraph>{'Battle logs uploaded successfully!'}</Paragraph>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form
        handleSubmit={handleSubmit}
        button1={{ type: 'button', variant: 'secondary', text: 'Cancel' }}
        button2={{
          type: 'submit',
          variant: 'primary',
          text: submitButtonText,
        }}
        handleClick={() => router.back()}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Player 1'
            id='player1'
            name='player1'
            type='text'
            value={formData.player1}
            onChange={handleChange}
            required
          />
          <Input
            label='Player 2'
            id='player2'
            name='player2'
            type='text'
            value={formData.player2}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor='owner'>{'Log Owner:'}</label>
            <select
              id='owner'
              name='owner'
              value={formData.owner}
              onChange={handleChange}
              className='block w-full p-2 border rounded-md text-background bg-foreground mt-0.5'
              required
            >
              <option value=''>{'Select owner'}</option>
              <option value={formData.player1}>
                {formData.player1 || 'Player 1'}
              </option>
              <option value={formData.player2}>
                {formData.player2 || 'Player 2'}
              </option>
            </select>
          </div>
          <Input
            label='Match Date & Time'
            id='date'
            name='date'
            type='datetime-local'
            value={formData.date}
            onChange={handleChange}
            required
          />
          <div>
            <label htmlFor='tournament_id'>{'Tournament:'}</label>
            <select
              id='tournament_id'
              name='tournament_id'
              value={formData.tournament_id}
              onChange={handleChange}
              className='block w-full p-2 border rounded-md text-background bg-foreground mt-0.5'
            >
              <option value=''>{'Select a tournament'}</option>
              {tournaments.map((tournament) => (
                <option key={tournament.id} value={tournament.id}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label='Match Region (EU, NA, ...)'
            id='region'
            name='region'
            type='text'
            value={formData.region}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor='logs'>{'Battle Logs:'}</label>
          <textarea
            id='logs'
            name='logs'
            rows={10}
            value={formData.logs}
            onChange={handleChange}
            className='block w-full p-2 border rounded-md text-background bg-foreground mt-0.5'
            placeholder='Paste your battle logs here...'
            required={!isEditMode}
          />
        </div>

        <div>
          <label htmlFor='petUsage'>{'Pet Usage Summary:'}</label>
          <textarea
            id='petUsage'
            name='petUsage'
            rows={5}
            value={formData.petUsage}
            onChange={handleChange}
            className='block w-full p-2 border rounded-md text-background bg-foreground mt-0.5'
            placeholder='Paste your pet usage summary here...'
            required={!isEditMode}
          />
        </div>
      </Form>
    </div>
  );
}
