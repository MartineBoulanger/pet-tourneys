'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BiLogIn } from 'react-icons/bi';
import { createComment } from '@/actions/supabase/cms-schema/comments/createComment';
import { Input, Form, Heading } from '@/components/ui';
import { RichTextEditor } from '@/components/layout/RichTextEditor';
import { CommentFormProps } from '@/types/components.types';
import { toastError } from '@/utils/toast';

export function CommentForm({
  pageid,
  username,
  isLoggedIn,
  path,
  userId,
}: CommentFormProps) {
  const [name, setName] = useState(username || '');
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      toastError('You must be logged in to post a comment.');
      return;
    }
    const commentData = {
      pageid,
      name,
      username,
      content,
      user_id: userId,
    };
    await createComment(commentData, path);
    setContent('');
    if (!username) setName('');
  }

  if (!isLoggedIn) {
    return (
      <div className='p-2.5 lg:p-5 bg-light-grey rounded-lg shadow-md'>
        <Heading as='h2' className='mb-2.5'>
          {'Join the Conversation'}
        </Heading>
        <div className='bg-background p-5 rounded-lg text-center'>
          <div className='py-5 space-y-5'>
            <p className='text-foreground/80'>
              {'You need to be logged in to post a comment'}
            </p>
            <p className='text-sm text-foreground/50'>
              {
                'Log in with Discord to share your thoughts and join the discussion!'
              }
            </p>
            <Link
              href='/login'
              className='btn-submit inline-flex items-center gap-2.5 py-[7px] px-[11px] uppercase rounded-md'
            >
              <BiLogIn className='h-5 w-5' />
              {'Log in to Comment'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-2.5 lg:p-5 bg-light-grey rounded-lg shadow-md'>
      <Heading as='h2' className='mb-2.5'>
        {'Add Your Comment'}
      </Heading>
      <Form
        handleSubmit={handleSubmit}
        button2={{
          variant: 'primary',
          type: 'submit',
          text: 'Post Comment',
        }}
      >
        <Input
          label='Your name'
          id='name'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <label className='block mb-0.5'>{'Comment:'}</label>
          <RichTextEditor
            content={content || ''}
            onChange={(text) => setContent(text)}
            className='min-h-[200px]'
            isComment
          />
        </div>
      </Form>
    </div>
  );
}
