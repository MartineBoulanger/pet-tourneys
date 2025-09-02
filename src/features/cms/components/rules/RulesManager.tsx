'use client';

import { useState, useEffect } from 'react';
import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaBars,
  FaFolderPlus,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import {
  getRules,
  deleteRule,
  reorderRules,
} from '@/features/cms/actions/rules';
import { Rule as RuleType } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { RuleForm } from './RuleForm';

export function RulesManager() {
  const [rules, setRules] = useState<RuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleType | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await getRules();
      setRules(data);
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingRule(undefined);
    loadRules();
  };

  const handleEdit = (rule: RuleType) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    setDeletingId(ruleId);
    try {
      const result = await deleteRule(ruleId);
      if (result.success) {
        await loadRules();
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

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingRule(undefined);
  };

  const handleDragStart = (e: React.DragEvent, ruleId: string) => {
    setDraggedItem(ruleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetRuleId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetRuleId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = rules.findIndex((r) => r._id === draggedItem);
    const targetIndex = rules.findIndex((r) => r._id === targetRuleId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newRules = [...rules];
    const draggedRule = newRules[draggedIndex];
    newRules.splice(draggedIndex, 1);
    newRules.splice(targetIndex, 0, draggedRule);
    setRules(newRules);

    const ruleIds = newRules.map((r) => r._id);
    try {
      await reorderRules(ruleIds);
    } catch (error) {
      console.error('Error reordering rules:', error);
      await loadRules();
    }

    setDraggedItem(null);
  };

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new rule button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 lg:gap-5 mb-2.5 lg:mb-5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Rule'}
          </Button>
        )}
      </div>

      {/* Form for new/edit rule */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <RuleForm
            rule={editingRule}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Rules list */}
      {rules.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No rules found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create you first rule to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Rule'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          <div className='text-sm text-foreground/50 mb-2.5 flex items-center gap-2.5'>
            <FaBars className='h-5 w-5' />
            {'Drag the rules to change the order'}
          </div>

          {rules.map((rule, index) => (
            <div
              key={rule._id}
              draggable
              onDragStart={(e) => handleDragStart(e, rule._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rule._id)}
              className={`bg-background rounded-lg p-2.5 lg:p-5 transition-all cursor-move ${
                draggedItem === rule._id ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex items-center gap-2.5'>
                    <FaBars className='h-5 w-5 text-foreground/50' />
                    <span className='bg-light-grey px-2 py-1 rounded text-sm'>
                      {'#'}
                      {index + 1}
                    </span>
                  </div>

                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid'
                    >
                      {rule.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {rule.images?.length || 0}
                        {' image'}
                        {rule.images?.length !== 1 ? 's' : ''}
                      </div>
                      {rule.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {new Date(rule.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(rule)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDeleteRule(rule._id)}
                    disabled={deletingId === rule._id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete'
                  >
                    {deletingId === rule._id ? (
                      <div className='h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <FaTrashAlt className='h-5 w-5' />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
