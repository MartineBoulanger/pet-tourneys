'use client';

import { useState, useEffect } from 'react';
import {
  FaTrashAlt,
  FaEdit,
  FaImage,
  FaPlus,
  FaFolderPlus,
  FaEye,
  FaEyeSlash,
  FaGripVertical,
} from 'react-icons/fa';
import { IoMdCalendar } from 'react-icons/io';
import {
  getSignups,
  deleteSignup,
  setVisibleSignup,
  hideSignup,
} from '@/features/cms/actions/signups';
import { Signup } from '@/features/cms/types';
import {
  Button,
  Heading,
  Paragraph,
  CMSManagerSkeleton,
} from '@/components/ui';
import { SignupForm } from './SignupsForm';

export function SignupsManager() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState<string | null>(
    null
  );
  const [editingSignup, setEditingSignup] = useState<Signup | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSignups = async () => {
    setLoading(true);
    try {
      const result = await getSignups();
      if (result.success) {
        setSignups(result.signups || []);
      } else {
        console.error('Error loading signups:', result.error);
        setSignups([]);
      }
    } catch (error) {
      console.error('Error loading signups:', error);
      setSignups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignups();
  }, []);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSignup(undefined);
    loadSignups();
  };

  const handleEdit = (signup: Signup) => {
    setEditingSignup(signup);
    setShowForm(true);
  };

  const handleDelete = async (signupId: string) => {
    if (!confirm('Are you sure you want to delete this signup section?')) {
      return;
    }

    setDeletingId(signupId);
    try {
      const result = await deleteSignup(signupId);
      if (result.success) {
        await loadSignups();
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

  const handleToggleVisibility = async (signup: Signup) => {
    setTogglingVisibility(signup._id);
    try {
      let result;

      if (signup.isVisible) {
        result = await hideSignup(signup._id);

        if (result.success) {
          setSignups((prevSignups) =>
            prevSignups.map((s) =>
              s._id === signup._id ? { ...s, isVisible: false } : s
            )
          );
        }
      } else {
        result = await setVisibleSignup(signup._id);

        if (result.success) {
          setSignups((prevSignups) =>
            prevSignups.map((s) => ({
              ...s,
              isVisible: s._id === signup._id,
            }))
          );
        }
      }

      if (!result.success) {
        alert(result.error || 'Error updating visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('An unexpected error occurred');
    } finally {
      setTogglingVisibility(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSignup(undefined);
  };

  if (loading) return <CMSManagerSkeleton />;

  return (
    <div className='space-y-2.5 lg:space-y-5'>
      {/* Header with new button */}
      <div className='flex flex-wrap items-center justify-center gap-2.5 mb-2.5'>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2.5 py-[7px] px-[11px] rounded-lg'
          >
            <FaPlus className='h-4 w-4' />
            {'New Signup'}
          </Button>
        )}
      </div>

      {/* Form for new/edit */}
      {showForm && (
        <div className='bg-light-grey rounded-lg p-2.5 lg:p-5 shadow-md'>
          <SignupForm
            signup={editingSignup}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {signups.length === 0 ? (
        <div className='bg-light-grey rounded-lg shadow-md p-2.5 lg:p-5'>
          <div className='flex flex-col items-center justify-center text-center bg-background rounded-lg py-12 px-2.5 lg:px-5'>
            <FaFolderPlus className='text-humanoid mb-6 w-24 h-24' />
            <div className='text-foreground/30 text-lg mb-2'>
              {'No signup sections found'}
            </div>
            <Paragraph className='text-foreground/50 text-sm mb-4'>
              {'Create your first signup section to get started'}
            </Paragraph>
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className='px-4 py-2'>
                {'Create First Signup Section'}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className='space-y-2.5 bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md'>
          {signups.map((signup) => (
            <div
              key={signup._id}
              className='bg-background rounded-lg p-2.5 lg:px-5'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5 flex-1'>
                  <div className='flex-1'>
                    <Heading
                      as='h3'
                      className='text-lg font-bold text-humanoid mb-2'
                    >
                      {signup.title}
                    </Heading>

                    <div className='flex flex-wrap items-center gap-2.5 lg:gap-5 text-sm text-foreground/80'>
                      <div className='flex items-center gap-1'>
                        <FaImage className='h-4 w-4' />
                        <Paragraph>
                          {signup.images.length}
                          {' images'}
                        </Paragraph>
                      </div>
                      <div className='flex items-center gap-1'>
                        <FaGripVertical className='h-4 w-4' />
                        <Paragraph>
                          {signup.layout}
                          {' columns'}
                        </Paragraph>
                      </div>
                      {signup.createdAt && (
                        <div className='flex items-center gap-1'>
                          <IoMdCalendar className='h-4 w-4' />
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </div>
                      )}
                      <div className='flex items-center gap-1'>
                        <Paragraph
                          className={`px-1.5 rounded-full text-xs ${
                            signup.isVisible
                              ? 'bg-light-green text-dark-green border border-dark-green'
                              : 'bg-foreground/70 text-light-grey border border-light-grey'
                          }`}
                        >
                          {signup.isVisible ? 'Visible' : 'Hidden'}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex gap-2.5 ml-2.5'>
                  <Button
                    type='button'
                    variant='link'
                    onClick={() => handleToggleVisibility(signup)}
                    disabled={togglingVisibility === signup._id || showForm}
                    className={`p-1 rounded ${
                      signup.isVisible ? 'text-humanoid' : 'text-foreground/50'
                    }`}
                    title={signup.isVisible ? 'Hide signup' : 'Show signup'}
                  >
                    {togglingVisibility === signup._id ? (
                      <div className='h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin' />
                    ) : signup.isVisible ? (
                      <FaEye className='w-5 h-5' />
                    ) : (
                      <FaEyeSlash className='w-5 h-5' />
                    )}
                  </Button>

                  <div className='flex flex-col lg:flex-row gap-2.5 ml-2.5'>
                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleEdit(signup)}
                      disabled={showForm || togglingVisibility === signup._id}
                      className='btn-link'
                      title='Edit Signup'
                    >
                      <FaEdit className='h-5 w-5' />
                    </Button>

                    <Button
                      type='button'
                      variant='link'
                      onClick={() => handleDelete(signup._id)}
                      disabled={
                        deletingId === signup._id ||
                        showForm ||
                        togglingVisibility === signup._id
                      }
                      className='btn-link hover:text-red'
                      title='Delete Signup'
                    >
                      {deletingId === signup._id ? (
                        <div className='h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin' />
                      ) : (
                        <FaTrashAlt className='h-5 w-5' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
