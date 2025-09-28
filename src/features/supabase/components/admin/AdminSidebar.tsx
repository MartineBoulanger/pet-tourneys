'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { RiMenuFold4Line, RiMenuFold3Line } from 'react-icons/ri';
import { adminData } from '@/lib/navigationData';
import { Button } from '@/components/ui';

interface AdminSidebarProps {
  isFwenLoggedIn?: boolean;
}

export const AdminSidebar = ({ isFwenLoggedIn = false }: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

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
            <div className='space-y-2.5'>
              {isFwenLoggedIn && (
                <Link
                  className='btn-link flex items-center justify-start gap-2.5 border py-2 px-4 rounded-md border-blue-grey hover:bg-blue-grey hover:text-foreground'
                  href='/admin/upload-pets'
                  title='Upload Pets Data'
                  aria-label='Upload Pets Data'
                  onClick={closeSidebar}
                >
                  <div className='w-8 h-8 flex-shrink-0'>
                    <Image
                      src='/images/redrex.png'
                      alt='Upload Pets Data'
                      width={32}
                      height={32}
                      className='w-full h-full object-cover'
                      loading='lazy'
                      unoptimized
                    />
                  </div>
                  <span>{'Upload Pets Data'}</span>
                </Link>
              )}

              {adminData.map(({ linkText, imageSrc, id, url }) => (
                <Link
                  className='btn-link flex items-center justify-start gap-2.5 border py-2 px-4 rounded-md border-blue-grey hover:bg-blue-grey hover:text-foreground'
                  key={id}
                  href={url}
                  title={linkText}
                  aria-label={linkText}
                  onClick={closeSidebar}
                >
                  <div className='w-8 h-8 flex-shrink-0'>
                    <Image
                      src={imageSrc}
                      alt={linkText}
                      width={32}
                      height={32}
                      className='w-full h-full object-cover'
                      loading='lazy'
                      unoptimized
                    />
                  </div>
                  <span>{linkText}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};
