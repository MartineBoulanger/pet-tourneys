'use client';

import Image from 'next/image';
import { CarouselItem } from './types';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

export const Thumbnails = ({
  items,
  goTo,
  currentIndex,
}: {
  items: CarouselItem[] | string[] | number[] | undefined;
  goTo: (i: number) => void;
  currentIndex: number;
}) => {
  return (
    <div className='flex items-center justify-center gap-2 overflow-hidden transition-transform duration-300 py-2.5'>
      {items &&
        items.map((item, idx) => {
          const isCarouselItem =
            typeof item === 'object' && !Array.isArray(item) && item !== null;

          return (
            <Button
              key={idx + 1}
              className={cn(
                'relative flex-shrink-0 rounded-lg p-0 overflow-hidden transition-all duration-200 ease-in-out snap-x snap-center',
                currentIndex === idx + 1
                  ? 'ring-2 ring-foreground scale-105'
                  : 'opacity-60 hover:opacity-100 hover:ring-1',
                isCarouselItem ? 'h-10 w-10 md:h-20 md:w-20' : 'h-8 w-8'
              )}
              onClick={() => goTo(idx)}
              aria-label={
                isCarouselItem
                  ? item.mobile?.image?.alt || `View thumbnail ${idx + 1}`
                  : `View thumbnail ${idx + 1}`
              }
            >
              {isCarouselItem ? (
                <div className='relative w-full h-full'>
                  <Image
                    src={(item as CarouselItem).mobile?.image?.src || ''}
                    alt={
                      (item as CarouselItem).mobile?.image?.alt ||
                      `Thumbnail ${idx + 1}`
                    }
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 64px, 80px'
                  />
                </div>
              ) : (
                <span className='flex h-full w-full items-center justify-center text-sm font-bold'>
                  {String(item)}
                </span>
              )}
            </Button>
          );
        })}
    </div>
  );
};
