'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Button } from '@/components/ui';
import { headerData } from '@/lib/headerData';

export const Mobile = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  function toggleMenu() {
    setOpen(true);
  }

  return (
    <div className='md:hidden'>
      <div className='flex items-center gap-x-5 p-5'>
        <Button
          title='Mobile Nav Menu'
          aria-label='Mobile Nav Menu'
          type='button'
          variant='link'
          onClick={toggleMenu}
        >
          <GiHamburgerMenu />
        </Button>
      </div>

      {isOpen ? (
        <div className='fixed inset-0 flex items-center justify-center bg-background/70'>
          <div className='fixed top-0 bottom-0 right-0 w-full max-w-[430px] shadow-md text-center flex flex-col bg-background animate-slide-in-right'>
            {/* Menu Header */}
            <div className='px-5 py-7 w-full flex items-center mb-5 bg-dark-grey justify-end'>
              <Button
                title='Close Nav Menu'
                aria-label='Close Nav Menu'
                type='button'
                onClick={() => setOpen(false)}
              >
                <IoMdClose className='w-6 h-6' />
              </Button>
            </div>

            <div className='my-10 mx-5 flex flex-col items-center border-t border-blue-grey'>
              {headerData.map((link) => (
                <Link
                  className='link w-full text-left p-5 border-b border-blue-grey'
                  key={link.id}
                  href={link.url}
                  onClick={() => setOpen(false)}
                >
                  {link.linkText}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
