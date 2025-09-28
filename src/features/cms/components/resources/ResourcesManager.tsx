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
  getResources,
  deleteResource,
  reorderResources,
} from '@/features/cms/actions/resources';
import { Resource as ResourceType } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { ResourceForm } from './ResourceForm';

export function ResourcesManager() {
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<
    ResourceType | undefined
  >();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await getResources();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingResource(undefined);
    loadResources();
  };

  const handleEdit = (resource: ResourceType) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource section?')) {
      return;
    }

    setDeletingId(resourceId);
    try {
      const result = await deleteResource(resourceId);
      if (result.success) {
        await loadResources();
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
    setEditingResource(undefined);
  };

  const handleDragStart = (e: React.DragEvent, resourceId: string) => {
    setDraggedItem(resourceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetResourceId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetResourceId) {
      setDraggedItem(null);
      return;
    }

    const draggedIndex = resources.findIndex((r) => r._id === draggedItem);
    const targetIndex = resources.findIndex((r) => r._id === targetResourceId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newResources = [...resources];
    const draggedResource = newResources[draggedIndex];
    newResources.splice(draggedIndex, 1);
    newResources.splice(targetIndex, 0, draggedResource);
    setResources(newResources);

    const resourceIds = newResources.map((r) => r._id);
    try {
      await reorderResources(resourceIds);
    } catch (error) {
      console.error('Error reordering:', error);
      await loadResources();
    }

    setDraggedItem(null);
  };

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
            resource={editingResource}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Resources list */}
      {resources.length === 0 ? (
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

          {resources.map((resource, index) => (
            <div
              key={resource._id}
              draggable
              onDragStart={(e) => handleDragStart(e, resource._id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, resource._id)}
              className={`bg-background rounded-lg p-2.5 lg:px-5 transition-all cursor-move ${
                draggedItem === resource._id ? 'opacity-50 scale-95' : ''
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
                      {resource.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />{' '}
                          {new Date(resource.createdAt).toLocaleDateString()}
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
                    onClick={() => handleDelete(resource._id)}
                    disabled={deletingId === resource._id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Resource'
                  >
                    {deletingId === resource._id ? (
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
