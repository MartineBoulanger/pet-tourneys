'use client';

import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Image from 'next/image';
import { ImageUpload } from '@/mongoDB/types';
import { Button, Paragraph } from '@/components/ui';

interface CarouselProps {
  images: ImageUpload[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  className?: string;
  aspectRatio?: string;
  pauseOnHover?: boolean;
}

const Carousel = ({
  images,
  autoPlay = true,
  autoPlayInterval = 5000,
  showThumbnails = false,
  showControls = true,
  className = '',
  aspectRatio = '16/9',
  pauseOnHover = true,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = images.length;
  const hasMultipleImages = totalImages > 1;

  // Navigate to specific index
  const goToSlide = (index: number) => {
    if (isAnimating || !hasMultipleImages) return;

    setIsAnimating(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Navigate to next slide
  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % totalImages;
    goToSlide(nextIndex);
  };

  // Navigate to previous slide
  const prevSlide = () => {
    const prevIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  };

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || !hasMultipleImages || (pauseOnHover && isHovered)) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    autoPlay,
    hasMultipleImages,
    isHovered,
    pauseOnHover,
    nextSlide,
    autoPlayInterval,
  ]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  if (totalImages === 0) {
    return (
      <div
        className={`relative bg-light-grey rounded-lg flex items-center justify-center ${className}`}
      >
        <Paragraph>{'No images available'}</Paragraph>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-light-grey ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role='region'
      aria-label='Image carousel'
    >
      {/* Main image container */}
      <div
        className='relative w-full'
        style={{ aspectRatio }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={image._id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className='object-contain'
              priority={index === 0}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
            />
          </div>
        ))}

        {/* Loading overlay for current image */}
        <div
          className='absolute inset-0'
          style={{
            opacity: isAnimating ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      </div>

      {/* Navigation controls */}
      {showControls && hasMultipleImages && (
        <>
          <Button
            onClick={prevSlide}
            disabled={isAnimating}
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-background rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Previous image'
          >
            <FaChevronLeft className='w-5 h-5' />
          </Button>

          <Button
            onClick={nextSlide}
            disabled={isAnimating}
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-foreground/80 hover:bg-foreground text-background rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Next image'
          >
            <FaChevronRight className='w-5 h-5' />
          </Button>
        </>
      )}

      {/* Thumbnails */}
      {showThumbnails && hasMultipleImages && (
        <div className='absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-2.5 bg-background/70 rounded-lg p-2'>
          {images.map((image, index) => (
            <Button
              variant='link'
              key={image._id}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className={`relative w-16 h-12 rounded overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-foreground scale-110'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Thumbnail for ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className='object-cover'
                sizes='64px'
              />
            </Button>
          ))}
        </div>
      )}

      {/* Image counter */}
      {hasMultipleImages && (
        <div className='absolute top-4 right-4 bg-background/60 text-foreground px-3 py-1 rounded-full text-sm font-medium'>
          {currentIndex + 1} / {totalImages}
        </div>
      )}
    </div>
  );
};

export default Carousel;
