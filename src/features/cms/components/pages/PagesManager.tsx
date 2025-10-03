'use client';

import { useState, useEffect } from 'react';
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaFolderPlus,
  FaFileAlt,
  FaImage,
} from 'react-icons/fa';
import { IoMdCalendar, IoMdLink } from 'react-icons/io';
import {
  getPagesByType,
  deletePage,
  getPages,
} from '@/features/cms/actions/pages';
import { Page } from '@/features/cms/types';
import { getTypeLabel } from '@/features/cms/utils';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { PageForm } from './PageForm';

export function PagesManager({ type = '' }: { type?: string }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const loadPages = async () => {
    setLoading(true);
    try {
      if (!type) {
        const data = await getPages();
        setPages(data);
      } else {
        const data = await getPagesByType(type);
        setPages(data);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPage(undefined);
    loadPages();
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    setDeletingId(pageId);
    try {
      const result = await deletePage(pageId);
      if (result.success) {
        await loadPages();
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
    setEditingPage(undefined);
  };

  const filteredPages =
    filterType === 'all'
      ? pages
      : pages.filter((page) => page.type === filterType);

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new page button and filters */}
      <div className='flex flex-wrap items-center justify-center lg:justify-between gap-2.5 mb-2.5'>
        {/* Filter Tabs */}
        <div className='flex gap-2.5'>
          {['all', 'articles', 'guides', 'pet-reviews'].map((type) => (
            <Button
              key={type}
              onClick={() => setFilterType(type)}
              variant={filterType === type ? 'primary' : 'link'}
              className='text-sm py-1.5 px-3'
            >
              {type === 'all' ? 'All' : getTypeLabel(type)}
            </Button>
          ))}
        </div>

        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Page'}
          </Button>
        )}
      </div>

      {/* Form for new/edit page */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <PageForm
            page={editingPage}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Pages list */}
      {filteredPages.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2.5'>
              {'No pages found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {filterType === 'all'
                ? 'Create your first page to get started'
                : `No ${getTypeLabel(filterType).toLowerCase()} found`}
            </Paragraph>
            {!showForm && filterType === 'all' && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Page'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {filteredPages.map((page) => (
            <div
              key={page._id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2.5 mb-2.5'>
                    <Heading as='h3' className='font-bold text-humanoid'>
                      {page.title}
                    </Heading>
                    <span className='px-2 py-0.5 bg-light-grey text-foreground text-xs rounded-full'>
                      {getTypeLabel(page.type)}
                    </span>
                    {page.published ? (
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
                    {page.bannerUrl && (
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        {'Banner'}
                      </div>
                    )}
                    {page.createdAt && (
                      <div className='flex items-center gap-1'>
                        <IoMdCalendar className='h-4 w-4' />
                        {new Date(page.createdAt).toLocaleDateString()}
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
                    onClick={() => handleDeletePage(page._id)}
                    disabled={deletingId === page._id || showForm}
                    className='btn-link hover:text-red'
                    title='Delete Page'
                  >
                    {deletingId === page._id ? (
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
