'use client';

import { cn } from '@/utils/cn';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Heading, Button } from '@/components/ui';

const getVisibleCount = () => {
  if (typeof window === 'undefined') return 5;
  const width = window.innerWidth;
  if (width < 640) return 1;
  if (width < 1024) return 3;
  return 5;
};

export const Carousel = ({
  data,
  className,
}: {
  data: {
    image: string;
    name: string;
  }[];
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(data.length / 2));
  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  const mod = (n: number, m: number) => ((n % m) + m) % m;
  const next = () => setCurrentIndex((prev) => mod(prev + 1, data.length));
  const prev = () => setCurrentIndex((prev) => mod(prev - 1, data.length));

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  return (
    <>
      <Heading
        as='h2'
        className='text-4xl mb-0 mt-10 text-center tracking-wider text-transparent bg-linear-to-r from-magic to-humanoid bg-clip-text'
      >
        {'Proud to partner with'}
      </Heading>
      <Container className='sm:mt-5 h-full'>
        {/* Carousel container */}
        <div
          className={cn(
            'relative mx-auto bg-light-grey py-10 px-5 rounded-lg shadow-md',
            className
          )}
        >
          {/* Image container */}
          <motion.div
            className='flex items-center justify-center gap-5'
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence initial={false}>
              {Array.from({ length: visibleCount }).map((_, i) => {
                const offset = i - Math.floor(visibleCount / 2);
                const index = mod(currentIndex + offset, data.length);
                const isCenter = offset === 0;

                return (
                  <motion.div
                    key={index}
                    className='flex flex-col items-center cursor-grab active:cursor-grabbing'
                    animate={{
                      opacity: isCenter ? 1 : 0.8,
                      scale: isCenter ? 1.1 : 0.9,
                    }}
                    transition={{
                      type: 'none',
                      easings: ['easeIn', 'easeOut'],
                    }}
                    onClick={() => setCurrentIndex(index)}
                    layout
                    title={data[index].name}
                    aria-label={data[index].name}
                  >
                    <Image
                      src={data[index].image}
                      alt={data[index].name}
                      width={220}
                      height={220}
                      className='object-cover w-full h-full'
                    />
                    <p className='mt-2.5 text-foreground font-bold'>
                      {data[index].name}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          <Button
            onClick={prev}
            className={`absolute left-2.5 top-1/2 transform -translate-y-1/2 bg-background text-foreground p-2.5 rounded-lg hover:bg-medium-grey`}
          >
            <FaChevronLeft className='w-6 h-6' />
          </Button>
          <Button
            onClick={next}
            className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 bg-background text-foreground p-2.5 rounded-lg hover:bg-medium-grey`}
          >
            <FaChevronRight className='w-6 h-6' />
          </Button>
        </div>
      </Container>
    </>
  );
};
