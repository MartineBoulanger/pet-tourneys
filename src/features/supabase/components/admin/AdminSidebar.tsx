'use client';

import { useState } from 'react';
import { RiMenuFold4Line, RiMenuFold3Line } from 'react-icons/ri';
import {
  adminData,
  leaguesAdminData,
  contentManagementData,
} from '@/lib/navigationData';
import { Button, Divider, Heading } from '@/components/ui';
import { AdminLink } from './AdminLink';

interface AdminSidebarProps {
  isFwenLoggedIn?: boolean;
  isAuthor?: boolean;
  isAdmin?: boolean;
}

export const AdminSidebar = ({
  isFwenLoggedIn = false,
  isAuthor = false,
  isAdmin = false,
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const filteredAdminData = adminData.filter(({ roleAllowed }) => {
    if (roleAllowed === 'both') return true;
    if (roleAllowed === 'admin') return isAdmin;
    if (roleAllowed === 'author') return isAuthor;
    return false;
  });

  const filteredLeaguesAdminData = leaguesAdminData.filter(
    ({ roleAllowed }) => {
      if (roleAllowed === 'both') return true;
      if (roleAllowed === 'admin') return isAdmin;
      if (roleAllowed === 'author') return isAuthor;
      return false;
    }
  );

  const filteredContentManagementData = contentManagementData.filter(
    ({ roleAllowed }) => {
      if (roleAllowed === 'both') return true;
      if (roleAllowed === 'admin') return isAdmin;
      if (roleAllowed === 'author') return isAuthor;
      return false;
    }
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        onClick={toggleSidebar}
        className='lg:hidden fixed top-20 left-0 rounded-l-none z-50 p-2'
        aria-label='Toggle menu'
      >
        <RiMenuFold4Line className='w-6 h-6' />
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-background/70 z-50'
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-10 w-full max-w-[430px] lg:max-w-[360px] bg-background shadow-md transform transition-transform duration-300 ease-in-out lg:rounded-lg lg:overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className='flex flex-col w-full h-full'>
          {/* Header */}
          <div className='py-2.5 px-5 h-16 bg-medium-grey lg:hidden flex items-center justify-end'>
            <Button
              onClick={closeSidebar}
              className='lg:hidden'
              aria-label='Close Sidebar menu'
            >
              <RiMenuFold3Line className='w-6 h-6' />
            </Button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 p-5 overflow-y-auto'>
            <div className='space-y-5'>
              <div className='space-y-2.5'>
                <Heading as='h3' className='text-humanoid'>
                  {'General Management'}
                </Heading>
                {isFwenLoggedIn && (
                  <AdminLink
                    onClose={closeSidebar}
                    url='/admin/upload-pets'
                    linkText='Upload Pets Data'
                    imageSrc='/images/redrex.png'
                  />
                )}
                {filteredAdminData.map(({ linkText, imageSrc, id, url }) => (
                  <AdminLink
                    key={id}
                    onClose={closeSidebar}
                    url={url}
                    linkText={linkText}
                    imageSrc={imageSrc}
                  />
                ))}
              </div>
              <Divider alignment='horizontal' height='0.5' color='light-grey' />
              {isAdmin && (
                <div className='space-y-2.5'>
                  <Heading as='h3' className='text-humanoid'>
                    {'Leagues Management'}
                  </Heading>
                  {filteredLeaguesAdminData.map(
                    ({ linkText, imageSrc, id, url }) => (
                      <AdminLink
                        key={id}
                        onClose={closeSidebar}
                        url={url}
                        linkText={linkText}
                        imageSrc={imageSrc}
                      />
                    )
                  )}
                </div>
              )}
              <Divider alignment='horizontal' height='0.5' color='light-grey' />
              <div className='space-y-2.5'>
                <Heading as='h3' className='text-humanoid'>
                  {'Content Management'}
                </Heading>
                {filteredContentManagementData.map(
                  ({ linkText, imageSrc, id, url }) => (
                    <AdminLink
                      key={id}
                      onClose={closeSidebar}
                      url={url}
                      linkText={linkText}
                      imageSrc={imageSrc}
                    />
                  )
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
