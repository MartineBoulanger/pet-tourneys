'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Button } from '@/components/ui';
import { headerData } from '@/lib/headerData';

export const Menu = ({
  className,
  buttonVariant = 'primary',
}: {
  className?: string;
  buttonVariant?: 'link' | 'primary' | 'secondary' | undefined;
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  function toggleMenu() {
    setOpen(true);
  }

  return (
    <div className={className}>
      <div className='flex items-center gap-x-5 md:gap-x-0 p-5 md:p-0'>
        <Button
          title='Mobile Nav Menu'
          aria-label='Mobile Nav Menu'
          type='button'
          variant={buttonVariant}
          onClick={toggleMenu}
        >
          <GiHamburgerMenu className='md:w-6 md:h-6' />
        </Button>
      </div>

      {isOpen ? (
        <>
          <div
            className='fixed w-full h-full inset-0 flex items-center justify-center bg-background/70'
            onClick={() => setOpen(false)}
          />
          <div className='fixed top-0 bottom-0 right-0 w-full max-w-[430px] shadow-md text-center flex flex-col bg-background animate-slide-in-right'>
            <div className='p-5 w-full flex items-center mb-5 bg-dark-grey justify-end'>
              <Button
                title='Close Nav Menu'
                aria-label='Close Nav Menu'
                type='button'
                onClick={() => setOpen(false)}
              >
                <IoMdClose className='w-6 h-6' />
              </Button>
            </div>

            <div className='my-5 mx-5 flex flex-col items-center'>
              {headerData.map((link) => (
                <Link
                  className='btn-link flex items-center justify-center gap-2.5 border w-full py-2.5 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
                  key={link.id}
                  href={link.url}
                  onClick={() => setOpen(false)}
                >
                  <span className='max-w-[40px] max-h-[40px]'>
                    <Image
                      src={link.imageSrc}
                      alt={link.linkText}
                      width={50}
                      height={50}
                      className='w-full h-full object-cover'
                    />
                  </span>
                  <span>{link.linkText}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
