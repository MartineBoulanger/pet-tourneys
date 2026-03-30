'use client';

import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaFolderPlus,
  FaFileAlt,
  FaImage,
} from 'react-icons/fa';
import { IoMdCalendar, IoMdLink } from 'react-icons/io';
import { getPages } from '@/actions/supabase/cms-schema/pages/getPages';
import { deletePage } from '@/actions/supabase/cms-schema/pages/deletePage';
import { Page } from '@/types/supabase.types';
import { getPageTypeLabel } from '@/utils/supabase/getPageTypeLabel';
import { Button, Heading, Paragraph } from '@/components/ui';
import { CMSManagerSkeleton } from '@/components/layout/Skeletons';
import { PageForm } from './PageForm';
import { useCMSManager } from '@/hooks/useCMSManager';

export function PagesManager({ type }: { type: Page['type'] }) {
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
  } = useCMSManager<Page>({
    fetchFn: () => getPages(type),
    deleteFn: (id) => deletePage(id, `/admin-panel/pages/${type}`),
    deleteConfirmMessage: 'Are you sure you want to delete this page?',
  });

  if (!type) return;
  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new page button and filters */}
      {!showForm && (
        <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Page'}
          </Button>
        </div>
      )}

      {/* Form for new/edit page */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <PageForm
            page={editingItem}
            type={type}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Pages list */}
      {items.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2.5'>
              {'No pages found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {`No ${getPageTypeLabel(type).toLowerCase()} found`}
            </Paragraph>
            <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
              {`Create First ${getPageTypeLabel(type).toLowerCase()}`}
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {items.map((page) => (
            <div
              key={page.id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2.5 mb-2.5'>
                    <Heading as='h3' className='font-bold text-humanoid'>
                      {page.title}
                    </Heading>
                    {page.ispublished ? (
                      <span className='px-2 py-0.5 bg-light-green text-dark-green text-xs rounded-full'>
                        {'Published'}
                      </span>
                    ) : (
                      <span className='px-2 py-0.5 bg-light-red text-dark-red text-xs rounded-full'>
                        {'Draft'}
                      </span>
                    )}
                  </div>

                  <div className='flex flex-wrap items-center gap-2.5 text-sm text-foreground/80'>
                    <div className='flex items-center gap-1'>
                      <IoMdLink className='h-4 w-4' />
                      <span>{'/' + page.type + '/' + page.slug}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <FaFileAlt className='h-4 w-4' />
                      {page.sections?.length || 0}
                      {' section'}
                      {page.sections?.length !== 1 ? 's' : ''}
                    </div>
                    {page.bannerimage && (
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {'Banner'}
                      </div>
                    )}
                    {page.createdat && (
                      <div className='flex items-center gap-1'>
                        <IoMdCalendar className='h-4 w-4' />
                        {page.createdat}
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleEdit(page)}
                    disabled={showForm}
                    className='btn-link'
                    title='Edit Page'
                  >
                    <FaEdit className='h-5 w-5' />
                  </Button>

                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleDelete(page.id)}
                    disabled={deletingId === page.id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Page'
                  >
                    {deletingId === page.id ? (
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
