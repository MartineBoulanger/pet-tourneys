'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Button } from '@/components/ui';
import { headerData } from '@/lib/navigationData';
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface MenuProps {
  className?: string;
  buttonVariant?: 'link' | 'primary' | 'secondary' | undefined;
}

export const Menu = ({ className, buttonVariant = 'primary' }: MenuProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);

  function toggleMenu() {
    setOpen(true);
  }

  function toggleDropdown() {
    setIsDropdown((prev) => !prev);
  }

  return (
    <div className={className}>
      <div className='flex items-center gap-x-5 lg:gap-x-0 p-5 lg:p-0'>
        <Button
          title='Mobile Nav Menu'
          aria-label='Mobile Nav Menu'
          type='button'
          variant={buttonVariant}
          onClick={toggleMenu}
        >
          <GiHamburgerMenu className='lg:w-6 lg:h-6' />
        </Button>
      </div>

      {isOpen ? (
        <>
          <div
            className='fixed w-full h-full inset-0 flex items-center justify-center bg-transparent'
            onClick={() => setOpen(false)}
          />
          <div className='fixed top-0 bottom-0 right-0 w-full max-w-[430px] shadow-lg text-center flex flex-col bg-background animate-slide-in-right'>
            <div className='p-5 w-full flex items-center mb-5 bg-dark-grey justify-end'>
              <Button
                title='Close Navigation Menu'
                aria-label='Close Navigation Menu'
                type='button'
                onClick={() => setOpen(false)}
              >
                <IoMdClose className='w-6 h-6' />
              </Button>
            </div>

            <div className='my-5 mx-5 flex flex-col items-center gap-2.5'>
              {headerData.map((link) => {
                return link.children ? (
                  <div
                    className='w-full border border-blue-grey rounded-lg'
                    key={link.id}
                  >
                    <Button
                      key={link.id}
                      className={cn(
                        'btn-link flex items-center justify-center gap-2.5 capitalize w-full py-2.5 hover:bg-blue-grey hover:text-foreground',
                        isDropdown
                          ? 'border-b border-blue-grey rounded-b-none'
                          : ''
                      )}
                      onClick={toggleDropdown}
                    >
                      <span className='max-w-[40px] max-h-[40px]'>
                        <Image
                          src={link.imageSrc}
                          alt={link.linkText}
                          width={40}
                          height={40}
                          className='w-full h-full object-cover'
                          loading='lazy'
                          unoptimized
                        />
                      </span>
                      <span>{link.linkText}</span>
                      <span>
                        {isDropdown ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </Button>
                    {isDropdown && (
                      <div className='flex flex-col items-start w-full'>
                        <Link
                          className={cn(
                            'btn-link font-normal flex items-center justify-center gap-2.5 w-full py-2.5  border-blue-grey hover:bg-blue-grey hover:text-foreground',
                            isDropdown ? '' : ''
                          )}
                          key={link.id}
                          href={link.url}
                          onClick={() => setOpen(false)}
                          title={'All ' + link.linkText}
                          aria-label={'All ' + link.linkText}
                        >
                          {'All '}
                          {link.linkText}
                        </Link>
                        {link.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className='btn-link font-normal flex items-center justify-center gap-2.5 w-full py-2.5 hover:bg-blue-grey hover:text-foreground hover:last:rounded-b-lg'
                            onClick={() => setOpen(false)}
                            title={child.text}
                            aria-label={child.text}
                          >
                            {child.text}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    className='btn-link flex items-center justify-center gap-2.5 border w-full py-2.5 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
                    key={link.id}
                    href={link.url}
                    onClick={() => setOpen(false)}
                    title={link.linkText}
                    aria-label={link.linkText}
                  >
                    <span className='max-w-[40px] max-h-[40px]'>
                      <Image
                        src={link.imageSrc}
                        alt={link.linkText}
                        width={40}
                        height={40}
                        className='w-full h-full object-cover'
                        loading='lazy'
                        unoptimized
                      />
                    </span>
                    <span>{link.linkText}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
