'use client';

import { useState } from 'react';
import { updateRule, deleteRule } from '@/mongoDB/actions/rules';
import { iRuleDocument, Rule } from '@/mongoDB/types';
import { RichTextEditor, Input, Button, Form, Heading } from '@/components/ui';
import { MdEditNote, MdDeleteForever } from 'react-icons/md';

interface RuleItemProps {
  rule: iRuleDocument;
}

export function RuleItem({ rule }: RuleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Rule>({
    title: rule.title,
    content: rule.content,
    order: rule.order,
    createdAt: rule.createdAt,
    updatedAt: rule.updatedAt,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateRule(String(rule._id), {
        ...formData,
        updatedAt: new Date(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update rule:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this rule?')) {
      await deleteRule(String(rule._id));
    }
  };

  if (isEditing || !rule._id) {
    return (
      <Form
        handleSubmit={handleSubmit}
        button1={{ variant: 'secondary', type: 'button', text: 'Cancel' }}
        button2={{ variant: 'primary', type: 'submit', text: 'Save' }}
        handleClick={() => setIsEditing(false)}
      >
        <Input
          label='Title'
          name='title'
          id='title'
          type='text'
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div>
          <label className='block mb-0.5'>{'Content:'}</label>
          <RichTextEditor
            content={formData.content}
            onChange={handleContentChange}
            className='min-h-[400px]'
            imgClassName='rules-img'
          />
        </div>
        <Input
          label='Order'
          name='order'
          id='order'
          type='number'
          value={formData.order}
          onChange={handleChange}
          required
        />
      </Form>
    );
  }

  return (
    <div className='bg-background p-2.5 rounded-lg'>
      <div className='flex flex-col lg:flex-row justify-between items-start overflow-auto'>
        <div className='space-y-2.5'>
          <Heading as='h2' className='tracking-widest text-humanoid mb-2.5'>
            {rule.title}
          </Heading>
          {/* <div>{rule.content}</div> */}
          <div dangerouslySetInnerHTML={{ __html: rule.content }} />
          <span className='text-sm text-foreground/60'>
            {'Order: '}
            {rule.order}
          </span>
        </div>
        <div className='flex lg:flex-col space-x-2.5 lg:space-x-0 lg:space-y-2.5 mt-2.5 lg:mt-0 lg:ml-5'>
          <Button
            onClick={() => {
              setFormData({
                title: rule.title,
                content: rule.content,
                order: rule.order,
                createdAt: rule.createdAt,
                updatedAt: rule.updatedAt,
              });
              setIsEditing(true);
            }}
            className='flex items-center justify-center gap-0.5'
          >
            <MdEditNote className='w-5 h-5' /> <span>{'Edit'}</span>
          </Button>
          <Button
            onClick={handleDelete}
            variant='secondary'
            className='flex items-center justify-center gap-0.5'
          >
            <MdDeleteForever className='w-5 h-5' /> <span>{'Delete'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
