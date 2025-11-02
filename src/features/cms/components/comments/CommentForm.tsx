'use client';

import { useState } from 'react';
import { createComment } from '@/features/cms/actions/comments';
import { Input, Form, Heading } from '@/components/ui';
import { RichTextEditor } from '../RichTextEditor';

export function CommentForm({
  pageId,
  username,
  path,
}: {
  pageId: string;
  username?: string;
  path: string;
}) {
  const [name, setName] = useState(username || '');
  const [content, setContent] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createComment({ pageId, name, username, content, path });
    setContent('');
    if (!username) setName('');
  }

  return (
    <div className='p-2.5 lg:p-5 bg-light-grey rounded-lg shadow-md'>
      <Heading as='h3' className='mb-2.5 text-lg font-bold'>
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
