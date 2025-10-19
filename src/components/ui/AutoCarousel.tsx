'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';

interface AutoCarouselProps {
  children: ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
}

export function AutoCarousel({
  children,
  speed = 30,
  gap = 16,
  className = '',
}: AutoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number>(0);
  const scrollPositionRef = useRef(0);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        scrollPositionRef.current += speed * delta;

        // Reset scroll position when we've scrolled past the first set of items
        const scrollWidth = scrollContainer.scrollWidth / 2;
        if (scrollPositionRef.current >= scrollWidth) {
          scrollPositionRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPositionRef.current;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, speed]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        lastTimeRef.current = Date.now();
      }}
    >
      <div
        ref={scrollRef}
        className='flex overflow-x-hidden'
        style={{ gap: `${gap}px` }}
      >
        {/* Duplicate children for seamless loop */}
        <div className='flex' style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className='flex' style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
