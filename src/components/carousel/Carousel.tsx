'use client';

import { RefObject, useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useSwipeable } from 'react-swipeable';
import { cn } from '@/utils/cn';
import { useHasFocus, useHover, useIsVisible } from '@/hooks/carousel';
import {
  deriveCarouselItemKey,
  DEFAULT_ASPECT_RATIO,
  DEFAULT_DURATION,
  breakPointClasses,
} from './utils';
import { CarouselProps, Device } from './types';
import { CarouselItem } from './CarouselItem';
import { Button } from '@/components/ui';
import { Thumbnails } from './Thumbnails';

const Carousel = ({
  items,
  breakpoint,
  slideDuration,
  noAutoPlay,
  heights,
  loadingComponent,
  blurQuality,
  noBlur,
  ariaLabel,
  showControls = false,
  thumbnails,
  autoPlayOutsideViewport,
  pauseOnHover = false,
}: CarouselProps) => {
  const breakpointClass: Device<string> = breakpoint
    ? breakPointClasses[breakpoint]
    : { desktop: 'hidden', mobile: 'flex' };
  const [index, setIndex] = useState(1);
  const [firstItemLoaded, setFirstItemLoaded] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [disableAnimation, setDisableAnimation] = useState(false);
  const [wilResetAnimationState, setWillResetAnimationState] = useState(false);
  const infiniteItems = [items[items.length - 1], ...items, items[0]];
  const onlyOneItem = items.length < 2;

  const incrIdx = () => {
    if (playAnimation || onlyOneItem) return;
    setPlayAnimation(true);
    setIndex((i) => i + 1);
  };

  const decrIdx = () => {
    if (playAnimation || onlyOneItem) return;
    setPlayAnimation(true);
    setIndex((i) => i - 1);
  };

  const jumpTo = (i: number) => {
    if (playAnimation || onlyOneItem) return;
    if (i < 1) {
      setIndex(1);
    } else if (i >= infiniteItems.length - 2) {
      setIndex(infiniteItems.length - 2);
    } else {
      setIndex(i + 1);
    }
  };

  const firstItem = items[0];
  const desktopAR =
    (firstItem.desktop?.image?.width || DEFAULT_ASPECT_RATIO[0]) /
    (firstItem.desktop?.image?.height || DEFAULT_ASPECT_RATIO[1]);
  const mobileAR =
    (firstItem.mobile?.image?.width || DEFAULT_ASPECT_RATIO[1]) /
    (firstItem.mobile?.image?.height || DEFAULT_ASPECT_RATIO[0]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useHover(containerRef as RefObject<HTMLDivElement>);
  const hasFocus = useHasFocus(containerRef as RefObject<HTMLDivElement>);
  const userIsEngaging = (isHovering && pauseOnHover) || hasFocus;
  const carouselIsInViewPort =
    useIsVisible(containerRef as RefObject<HTMLDivElement>) ||
    autoPlayOutsideViewport;
  const firstItemLoadedOrNoItems =
    firstItemLoaded || items.every((item) => !item.mobile?.image);

  const toggleFirstItemLoaded = () =>
    !firstItemLoaded && setFirstItemLoaded(true);

  const handlers = useSwipeable({
    onSwipedLeft: incrIdx,
    onSwipedRight: decrIdx,
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') incrIdx();
    if (e.key === 'ArrowLeft') decrIdx();
  };

  useEffect(() => {
    if (noAutoPlay || onlyOneItem || !carouselIsInViewPort) return;
    const interval = setInterval(() => {
      if (!userIsEngaging && firstItemLoadedOrNoItems) incrIdx();
    }, slideDuration || DEFAULT_DURATION);
    return () => clearInterval(interval);
  }, [
    noAutoPlay,
    isHovering,
    hasFocus,
    carouselIsInViewPort,
    onlyOneItem,
    slideDuration,
    items,
    firstItemLoaded,
  ]);

  useEffect(() => {
    if (index === infiniteItems.length - 1 || index === 0)
      setWillResetAnimationState(true);
  }, [index]);

  useEffect(() => {
    let timeout: undefined | NodeJS.Timeout;
    if (playAnimation) timeout = setTimeout(() => setPlayAnimation(false), 500);
    if (!playAnimation && wilResetAnimationState) {
      setIndex(
        index === infiniteItems.length - 1 ? 1 : infiniteItems.length - 2
      );
      setDisableAnimation(true);
      setWillResetAnimationState(false);
      requestAnimationFrame(() => {
        setDisableAnimation(false);
      });
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [playAnimation]);

  return (
    <section
      className='overflow-hidden w-full relative'
      ref={containerRef}
      onDragStart={(e) => e.preventDefault()}
      role='region'
      aria-label={ariaLabel || 'Image Carousel'}
    >
      <div
        className={cn(
          !disableAnimation
            ? 'motion-safe:transition-transform motion-safe:duration-500'
            : '',
          breakpointClass.mobile
        )}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onKeyDown={onKeyDown}
        {...handlers}
      >
        {infiniteItems.map((item, i) => (
          <div
            key={deriveCarouselItemKey({
              carouselItem: item,
              isFirstItem: i === 0,
              isLastItem: i === infiniteItems.length - 1,
              isMobileDevice: true,
            })}
            className='relative w-full flex-shrink-0'
            aria-hidden={i !== index}
            inert={i !== index}
            style={{
              aspectRatio: !heights?.mobile ? mobileAR : undefined,
              height: heights?.mobile,
            }}
          >
            <CarouselItem
              priority={i === 0}
              component={item.mobile?.component}
              image={item.mobile?.image}
              onLoad={i === 0 ? toggleFirstItemLoaded : undefined}
              increment={incrIdx}
              decrement={decrIdx}
              jumpTo={jumpTo}
              loadingComponent={loadingComponent}
              blurQuality={blurQuality}
              noBlur={noBlur}
            />
          </div>
        ))}
      </div>
      {!!breakpoint && (
        <div
          className={cn(
            !disableAnimation
              ? 'motion-safe:transition-transform motion-safe:duration-500'
              : '',
            breakpointClass.desktop
          )}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onKeyDown={onKeyDown}
          {...handlers}
        >
          {infiniteItems.map((item, i) => (
            <div
              key={deriveCarouselItemKey({
                carouselItem: item,
                isFirstItem: i === 0,
                isLastItem: i === infiniteItems.length - 1,
              })}
              className='relative w-full flex-shrink-0'
              style={{
                aspectRatio: !heights?.desktop ? desktopAR : undefined,
                height: heights?.desktop,
              }}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <CarouselItem
                priority={i === 0}
                component={item.desktop?.component}
                image={item.desktop?.image}
                onLoad={i === 0 ? toggleFirstItemLoaded : undefined}
                increment={incrIdx}
                decrement={decrIdx}
                loadingComponent={loadingComponent}
                blurQuality={blurQuality}
                jumpTo={jumpTo}
                noBlur={noBlur}
                isSingleSlide={items.length < 2}
              />
            </div>
          ))}
        </div>
      )}
      {showControls && (
        <div className='relative w-full max-w-[500px] mx-auto p-5'>
          <div className='flex items-center justify-center gap-2 overflow-hidden relative'>
            <Button
              onClick={decrIdx}
              disabled={onlyOneItem}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-background hover:bg-blue-grey'
            >
              <FaChevronLeft />
            </Button>
            <Thumbnails items={thumbnails} goTo={jumpTo} currentIndex={index} />
            <Button
              onClick={incrIdx}
              disabled={onlyOneItem}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg bg-background hover:bg-blue-grey'
            >
              <FaChevronRight />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carousel;
