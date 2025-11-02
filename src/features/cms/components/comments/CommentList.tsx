'use client';

import { useTransition, useState } from 'react';
import { deleteComment, updateComment } from '@/features/cms/actions/comments';
import { Comment } from '@/features/cms/types';
import { Paragraph, Button } from '@/components/ui';
import { RichTextEditor } from '../RichTextEditor';
import { cn } from '@/utils/cn';

export function CommentList({
  comments,
  username,
  isAdmin,
  path,
}: {
  comments: Comment[];
  username?: string;
  isAdmin: boolean;
  path: string;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [pending, startTransition] = useTransition();

  return (
    <div className=' p-2.5 lg:p-5 bg-background rounded-lg shadow-md'>
      {comments.length === 0 && (
        <Paragraph className='bg-light-grey p-5 rounded-lg text-center'>
          {'No comments yet'}
        </Paragraph>
      )}
      <div className='space-y-2.5 lg:space-y-5 max-h-[400px] lg:max-h-[600px] overflow-x-auto'>
        {comments.map((c) => (
          <div key={c._id} className='p-2.5 lg:p-5 rounded-lg bg-light-grey'>
            <Paragraph className='font-semibold mb-2.5'>
              {c.username || c.name || 'Anonymous'}
            </Paragraph>

            {editing === c._id ? (
              <div className='mb-2.5 p-2.5 lg:p-5 bg-background rounded-lg'>
                <div>
                  <label className='block mb-0.5'>{'Edit comment:'}</label>
                  <RichTextEditor
                    content={editContent || ''}
                    onChange={(text) => setEditContent(text)}
                    className='min-h-[200px]'
                    isComment
                  />
                </div>
                <div className='flex justify-end gap-2.5 mt-2.5'>
                  <Button variant='secondary' onClick={() => setEditing(null)}>
                    {'Cancel'}
                  </Button>
                  <Button
                    onClick={() =>
                      startTransition(() => {
                        updateComment(c._id, username!, editContent, path);
                        setEditing(null);
                      })
                    }
                    disabled={pending}
                  >
                    {'Save'}
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className='prose p-2.5 lg:p-5 bg-background rounded-lg'
                dangerouslySetInnerHTML={{ __html: c.content }}
              />
            )}

            <div
              className={cn(
                'flex mt-2.5',
                isAdmin || username === c.username
                  ? 'items-start justify-between'
                  : 'items-end justify-end'
              )}
            >
              {isAdmin || username === c.username ? (
                <div className='flex gap-2.5'>
                  {username === c.username ? (
                    <Button
                      onClick={() => {
                        startTransition(() => {
                          setEditContent(c.content);
                          setEditing(c._id);
                        });
                      }}
                      disabled={pending}
                    >
                      {'Edit'}
                    </Button>
                  ) : null}
                  <Button
                    variant='secondary'
                    onClick={() =>
                      startTransition(() => {
                        if (
                          !confirm(
                            'Are you sure you want to delete this comment?'
                          )
                        )
                          return;
                        deleteComment(c._id, path, username, isAdmin);
                      })
                    }
                    disabled={pending}
                  >
                    {'Delete'}
                  </Button>
                </div>
              ) : null}

              <Paragraph className='text-xs text-foreground/40'>
                {new Date(c.createdAt).toLocaleString()}
              </Paragraph>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
