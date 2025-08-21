import { HTMLProps } from 'react';
import { cn } from '@/utils/cn';

interface Video extends HTMLProps<HTMLElement> {
  url: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  mute?: boolean;
  showinfo?: boolean;
  modestbranding?: boolean;
  disablekb?: boolean;
}

/** this function matches the YouTube video url, and then extracts the video id from the url */
const getYouTubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const Video = ({
  url,
  title,
  autoplay = false,
  controls = false,
  mute = false,
  showinfo = false,
  modestbranding = false,
  disablekb = false,
  onClick,
  className,
}: Video) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return <div className={cn('text-red', className)}>Invalid YouTube URL</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!?.replace(/\/+$/, '');
  const domain = baseUrl
    ? encodeURIComponent(baseUrl)
    : 'https%3A%2F%2Fwww.petmastersleague.com';

  return (
    <div
      role='div'
      onClick={onClick}
      className={cn('w-full h-full', className)}
    >
      <div className='relative w-full h-0 pt-[56.25%] rounded-lg overflow-hidden'>
        <iframe
          id={`youtube-player-${url}`}
          data-testid='video-player-test'
          className='absolute top-0 left-0 w-full h-full optanon-category-C0001'
          allow='accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          title={title}
          name={title}
          data-ot-ignore
          width='100%'
          height='100%'
          src={`https://www.youtube-nocookie.com/embed/${videoId}?origin=${domain}&enablejsapi=1&autoplay=${
            autoplay ? 1 : 0
          }&showinfo=${showinfo ? 1 : 0}&controls=${
            controls ? 1 : 0
          }&fs=1&mute=${mute ? 1 : 0}&modestbranding=${
            modestbranding ? 1 : 0
          }&disablekb=${disablekb ? 1 : 0}&rel=0`}
          loading='lazy'
        />
      </div>
    </div>
  );
};
