import Image from 'next/image';
import { Announcement } from '@/types/supabase.types';
import { Video } from '@/components/layout/Video';
import { Heading } from '@/components/ui';

interface AnnouncementSectionProps {
  announcement: Announcement;
}

export function AnnouncementsSection({
  announcement,
}: AnnouncementSectionProps) {
  if (!announcement || !announcement.isvisible) return null;

  return (
    <div className='text-center'>
      {announcement.title ? (
        <>
          <Heading
            as='h2'
            className='text-2xl lg:text-3xl text-foreground/90 mx-auto'
          >
            {announcement.title}
          </Heading>
          <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        </>
      ) : null}

      {announcement.description ? (
        <div
          className='mb-2.5 prose'
          dangerouslySetInnerHTML={{ __html: announcement.description }}
        />
      ) : null}

      {announcement.mediatype === 'image' && announcement.image ? (
        <div className='w-full h-full'>
          <Image
            src={announcement.image.secure_url}
            alt={announcement.title || 'Announcement image'}
            style={{
              maxHeight: 'calc(90vh - 350px)',
              width: 'auto',
              height: 'auto',
            }}
            className='w-full h-full mx-auto object-cover rounded-lg overflow-hidden'
            width={announcement.image.width}
            height={announcement.image.height}
            priority
            unoptimized
          />
        </div>
      ) : null}

      {announcement.mediatype === 'video' && announcement.videourl ? (
        <Video
          url={announcement.videourl}
          title={announcement.title || 'YouTube Video PML'}
          autoplay
          controls
          mute
        />
      ) : null}
    </div>
  );
}
