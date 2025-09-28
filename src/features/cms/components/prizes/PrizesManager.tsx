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
  getPrizes,
  deletePrize,
  reorderPrizes,
} from '@/features/cms/actions/prizes';
import { Prize as PrizeType } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { PrizeForm } from './PrizeForm';

export function PrizesManager() {
  const [prizes, setPrizes] = useState<PrizeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrize, setEditingPrize] = useState<PrizeType | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const loadPrizes = async () => {
    setLoading(true);
    try {
      const data = await getPrizes();
      setPrizes(data);
    } catch (error) {
      console.error('Error loading prizes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrizes();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPrize(undefined);
    loadPrizes();
  };

  const handleEdit = (prize: PrizeType) => {
    setEditingPrize(prize);
    setShowForm(true);
  };

  const handleDeletePrize = async (prizeId: string) => {
    if (!confirm('Are you sure you want to delete this prize?')) {
      return;
    }

    setDeletingId(prizeId);
    try {
      const result = await deletePrize(prizeId);
      if (result.success) {
        await loadPrizes();
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
    setEditingPrize(undefined);
  };

  const handleDragStart = (e: React.DragEvent, prizeId: string) => {
    setDraggedItem(prizeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetPrizeId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetPrizeId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = prizes.findIndex((p) => p._id === draggedItem);
    const targetIndex = prizes.findIndex((p) => p._id === targetPrizeId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPrizes = [...prizes];
    const draggedRule = newPrizes[draggedIndex];
    newPrizes.splice(draggedIndex, 1);
    newPrizes.splice(targetIndex, 0, draggedRule);
    setPrizes(newPrizes);

    const prizeIds = newPrizes.map((p) => p._id);
    try {
      await reorderPrizes(prizeIds);
    } catch (error) {
      console.error('Error reordering prizes:', error);
      await loadPrizes();
    }

    setDraggedItem(null);
  };

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new prize button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Prize'}
          </Button>
        )}
      </div>

      {/* Form for new/edit prize */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <PrizeForm
            prize={editingPrize}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {prizes.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No prizes found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create you first prize to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Prize'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          <div className='text-sm text-foreground/50 mb-2.5 flex items-center gap-2.5'>
            <FaBars className='h-5 w-5' />
            {'Drag the prizes to change the order'}
          </div>

          {prizes.map((prize, index) => (
            <div
              key={prize._id}
              draggable
              onDragStart={(e) => handleDragStart(e, prize._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, prize._id)}
              className={`bg-background rounded-lg p-2.5 lg:px-5 transition-all cursor-move ${
                draggedItem === prize._id ? 'opacity-50 scale-95' : ''
              }`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5 flex-1'>
                  <div className='flex items-center gap-2.5 lg:gap-5'>
                    <FaBars className='h-5 w-5 text-foreground/50' />
                    <span className='bg-light-grey px-2 py-1 rounded text-sm'>
                      {'#'}
                      {index + 1}
                    </span>
                  </div>

                  <div className='flex-1'>
                    <Heading as='h3' className='font-bold text-humanoid'>
                      {prize.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {prize.images?.length || 0}
                        {' image'}
                        {prize.images?.length !== 1 ? 's' : ''}
                      </div>
                      {prize.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {new Date(prize.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(prize)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit Prize'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDeletePrize(prize._id)}
                    disabled={deletingId === prize._id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Prize'
                  >
                    {deletingId === prize._id ? (
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
