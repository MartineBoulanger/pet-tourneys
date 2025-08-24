'use client';

import { CgPlayButtonR } from 'react-icons/cg';
import { cn } from '@/utils/cn';
import { Media, YouTubeVideoProps } from './types';
import RichText from './RichText';
import { useState } from 'react';
import Image from 'next/image';

const getYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const YouTubeVideo = ({
  component,
  autoplay = false,
  showinfo = false,
  className,
  isContentLayout = false,
}: YouTubeVideoProps) => {
  const [thumbnail, setThumbnail] = useState<Media | null>(
    component?.thumbnail ? component.thumbnail : null
  );
  const [isAutoPlay, setIsAutoplay] = useState<boolean>(autoplay);

  if (!component) return null;

  const { title, youTubeUrl, description } = component;
  const videoId = getYouTubeVideoId(youTubeUrl);

  if (!videoId) return null;

  const handleThumbnailPlay = () => {
    setTimeout(() => {
      setIsAutoplay(true);
      setThumbnail(null);
    }, 100);
  };

  return (
    <div
      className={cn(
        'aspect-video w-full px-2.5 lg:pb-5',
        isContentLayout ? '' : 'lg:p-2.5',
        className
      )}
    >
      {thumbnail ? (
        <div
          className='relative aspect-video cursor-pointer rounded-lg overflow-hidden bg-transparent'
          onClick={handleThumbnailPlay}
        >
          <Image
            src={thumbnail?.url}
            alt={thumbnail?.title}
            width={thumbnail?.width}
            height={thumbnail?.height}
            className='w-full h-full object-contain'
          />
          <div className='absolute inset-0 flex items-center justify-center'>
            <CgPlayButtonR className='w-10 h-10' />
          </div>
        </div>
      ) : (
        <iframe
          id={`youtube-video-${videoId}`}
          className='w-full h-full rounded-lg overflow-hidden'
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${
            isAutoPlay ? 1 : 0
          }&showinfo=${
            showinfo ? 1 : 0
          }&controls=1&fs=1&mute=1&modestbranding=1&disabledkb=1&rel=0`}
          title={title || 'YouTube Video Player'}
          name={title || 'YouTube Video Player'}
          allow='accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          data-ot-ignore
          width='100%'
          height='100%'
          loading='lazy'
        />
      )}
      {description ? (
        <RichText component={description} className='mt-5' />
      ) : null}
    </div>
  );
};

export default YouTubeVideo;
