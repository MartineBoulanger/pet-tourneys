'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { uploadBattleLog } from '@/features/supabase/actions/uploadLogs';
import { updateMatchWithLogs } from '@/features/supabase/actions/matches';
import {
  Form,
  Input,
  UploadFormSkeleton,
  Textarea,
  Select,
  Option,
  Paragraph,
} from '@/components/ui';

export interface UploadFormProps {
  tournaments: Array<{ id: string; name: string }>;
  initialData?: {
    player1: string;
    player2: string;
    owner: string;
    date: string;
    logs: string;
    petUsage: string;
    tournament_id: string;
    region: string;
  };
  match_id?: string;
  isEditMode?: boolean;
}

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
        toast.error('Error!', {
          className: 'toast-error',
          description: result.error,
        });
        throw new Error(result.error);
      }

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

      toast.success('Success!', {
        className: 'toast-success',
        description: 'Battle logs uploaded successfully!',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error!', {
        className: 'toast-error',
        description:
          typeof error === 'string' ? error : 'Failed to submit the form',
      });
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
    <div className='bg-light-grey shadow-md rounded-lg p-2.5 lg:p-5'>
      <Paragraph className='w-full text-center mx-auto mb-2.5 text-sm bg-background py-2.5 px-2.5 lg:px-5 rounded-lg'>
        {
          'Upload/Edit the PvP pet battle logs and pet usage, fill in the match information, and track the match and logs.'
        }
      </Paragraph>
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5'>
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
          <Select
            label='Log Owner'
            id='owner'
            name='owner'
            required
            value={formData.owner}
            onChange={handleChange}
          >
            <Option value='' label='Select owner' />
            <Option
              value={formData.player1}
              label={formData.player1 || 'Player 1'}
            />
            <Option
              value={formData.player2}
              label={formData.player2 || 'Player 2'}
            />
          </Select>
          <Input
            label='Match Date & Time'
            id='date'
            name='date'
            type='datetime-local'
            value={formData.date}
            onChange={handleChange}
            required
          />
          <Select
            label='Choose League'
            id='tournament_id'
            name='tournament_id'
            value={formData.tournament_id}
            onChange={handleChange}
            required
          >
            <Option value='' label='Select a league that the logs belong to' />

            {tournaments.map((tournament) => (
              <Option
                key={tournament.id}
                value={tournament.id}
                label={tournament.name}
              />
            ))}
          </Select>
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
        <Textarea
          label='Battle Logs'
          id='logs'
          name='logs'
          rows={10}
          value={formData.logs}
          onChange={handleChange}
          placeholder='Paste your battle logs here...'
          required={!isEditMode}
        />
        <Textarea
          label='Pet Usage Summary'
          id='petUsage'
          name='petUsage'
          rows={5}
          value={formData.petUsage}
          onChange={handleChange}
          placeholder='Paste your pet usage summary here...'
          required={!isEditMode}
        />
      </Form>
    </div>
  );
}
