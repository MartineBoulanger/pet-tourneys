'use client';

import Image from 'next/image';
import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaFolderPlus,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import { getHalloffame } from '@/actions/supabase/cms-schema/halloffame/getHalloffame';
import { deleteHalloffame } from '@/actions/supabase/cms-schema/halloffame/deleteHalloffame';
import { HallOfFame, FLAGS } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { HalloffameForm } from './HalloffameForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function HalloffameManager() {
  const {
    items,
    loading,
    showForm,
    setShowForm,
    editingItem,
    deletingId,
    handleFormSuccess,
    handleEdit,
    handleCancelForm,
    handleDelete,
  } = useCMSManager<HallOfFame>({
    fetchFn: getHalloffame,
    deleteFn: deleteHalloffame,
    deleteConfirmMessage:
      'Are you sure you want to delete this hall of fame item?',
  });

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
            {'New Hall of Fame Item'}
          </Button>
        )}
      </div>

      {/* Form for new/edit hall of fame item */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <HalloffameForm
            hofItem={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No hall of fame items found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create you first hall of fame item to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Hall of Fame Item'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((item) => (
            <div
              key={item.id}
              className='bg-background rounded-lg p-2.5 lg:px-5 transition-all'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2.5 flex-1'>
                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='font-bold text-humanoid flex gap-2.5'
                    >
                      {item.season}
                      <Image
                        src={`https://flagcdn.com/w40/${FLAGS[item.region]}.png`}
                        alt='region flag'
                        width={28}
                        height={28}
                      />
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/50'>
                      <div className='flex items-center gap-1'>
                        {'Champion: '}
                        {item.champion}
                      </div>
                      <div className='flex items-center gap-1'>
                        {'Runner-Up: '}
                        {item.runnerup}
                      </div>
                      {item.petname ? (
                        <div className='flex items-center gap-1'>
                          {'Pet Champion: '}
                          {item.petname}
                        </div>
                      ) : null}
                    </div>

                    <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {item.avatar ? '' : 'no'}
                        {' avatar'}
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {item.petavatar ? '' : 'no'}
                        {' pet avatar'}
                      </div>
                      {item.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' /> {item.createdat}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(item)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit Prize'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Prize'
                  >
                    {deletingId === item.id ? (
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
