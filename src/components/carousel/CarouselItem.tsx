'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CarouselItemComponent } from './types';
import {
  DEFAULT_BLUR_WIDTH,
  DEFAULT_BLUR_QUALITY,
  getObjectPosition,
  isFunction,
} from './utils';
import { cn } from '@/utils/cn';

export const CarouselItem = ({
  image,
  priority,
  component,
  onLoad,
  loadingComponent,
  blurQuality,
  noBlur,
  decrement,
  increment,
  jumpTo,
  isSingleSlide,
}: CarouselItemComponent & {
  priority?: boolean;
  onLoad?: () => void;
  increment: () => void;
  decrement: () => void;
  jumpTo: (i: number) => void;
  loadingComponent?: React.ReactNode;
  blurQuality?: number;
  noBlur?: boolean;
  isSingleSlide?: boolean;
}) => {
  const [blurUri, setBlurUri] = useState<undefined | string>(undefined);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  useEffect(() => {
    if (!image?.src || image.blurDataURL || noBlur) return;
    fetch(
      image.src +
        `?w=${image.blurWidth || DEFAULT_BLUR_WIDTH}&q=${
          blurQuality || DEFAULT_BLUR_QUALITY
        }`
    )
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const base64 = Buffer.from(buffer).toString('base64');
        setBlurUri(`data:image/jpeg;base64,${base64}`);
      })
      .catch(console.error);
  }, [image]);

  const imageStyles: React.CSSProperties = {
    height: '100%',
    objectPosition: getObjectPosition(image, image?.imageFP),
    width: '100%',
  };

  return (
    <>
      {!!image?.src && (
        <>
          {!loaded && loadingComponent ? (
            loadingComponent
          ) : (
            <div
              className='absolute animate-pulse w-full bg-gray-300 transform h-full'
              aria-busy
            />
          )}
          <Image
            alt={image?.alt as string}
            src={image?.src}
            width={image.width}
            height={image.height}
            style={imageStyles}
            className={cn(
              'absolute inset-0 object-cover transition duration-200 select-none',
              {
                'blur-sm': !loaded,
                'cursor-grab': !isGrabbing && !isSingleSlide,
                'cursor-grabbing select-none': isGrabbing && !isSingleSlide,
              }
            )}
            onMouseDown={() => setIsGrabbing(true)}
            onMouseUp={() => setIsGrabbing(false)}
            onMouseLeave={() => setIsGrabbing(false)}
            priority={priority}
            blurDataURL={noBlur ? undefined : image.blurDataURL || blurUri}
            placeholder={
              noBlur || (!image.blurDataURL && !blurUri) ? undefined : 'blur'
            }
            onLoad={() => {
              setLoaded(true);
              if (onLoad) onLoad();
            }}
          />
        </>
      )}

      {!!component && (
        <div
          onMouseDown={() => setIsGrabbing(true)}
          onMouseUp={() => setIsGrabbing(false)}
          onMouseLeave={() => setIsGrabbing(false)}
          className={cn('absolute inset-0 w-full h-full select-none', {
            'cursor-grab': !isGrabbing && !isSingleSlide,
            'cursor-grabbing select-none': isGrabbing && !isSingleSlide,
          })}
        >
          {isFunction(component)
            ? component({ decrement, increment, jumpTo })
            : component}
        </div>
      )}
    </>
  );
};
