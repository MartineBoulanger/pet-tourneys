'use client';

import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaBars,
  FaFolderPlus,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import { getResources } from '@/actions/supabase/cms-schema/resources/getResources';
import { deleteResource } from '@/actions/supabase/cms-schema/resources/deleteResource';
import { reorderResources } from '@/actions/supabase/cms-schema/resources/updateResource';
import { Resource } from '@/types/supabase.types';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { ResourceForm } from './ResourceForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function ResourcesManager() {
  const {
    items,
    loading,
    showForm,
    setShowForm,
    editingItem,
    deletingId,
    draggedItem,
    handleFormSuccess,
    handleEdit,
    handleCancelForm,
    handleDelete,
    handleDragStart,
    handleDragDrop,
    handleDragOver,
  } = useCMSManager<Resource>({
    fetchFn: getResources,
    deleteFn: deleteResource,
    reorderFn: reorderResources,
    deleteConfirmMessage:
      'Are you sure you want to delete this resources section?',
  });

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new resource button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Resource Section'}
          </Button>
        )}
      </div>

      {/* Form for new/edit resource */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <ResourceForm
            resource={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Resources list */}
      {items.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No resources found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create your first resource section to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Resource'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          <div className='text-sm text-foreground/50 mb-2.5 flex items-center gap-2.5'>
            <FaBars className='h-5 w-5' />
            {'Drag the resources to change the order'}
          </div>

          {items.map((resource, index) => (
            <div
              key={resource.id}
              draggable
              onDragStart={(e) => handleDragStart(e, resource.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDragDrop(e, resource.id)}
              className={`bg-background rounded-lg p-2.5 lg:px-5 transition-all cursor-move ${
                draggedItem === resource.id ? 'opacity-50 scale-95' : ''
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
                      {resource.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {(resource.images && resource.images?.length) || 0}
                        {' image'}
                        {resource.images && resource.images?.length !== 1
                          ? 's'
                          : ''}
                      </div>
                      {resource.createdat && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {resource.createdat}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(resource)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit Resource'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDelete(resource.id)}
                    disabled={deletingId === resource.id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Resource'
                  >
                    {deletingId === resource.id ? (
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
