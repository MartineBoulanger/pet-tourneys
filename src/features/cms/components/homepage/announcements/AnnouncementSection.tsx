import Image from 'next/image';
import { Announcement } from '@/features/cms/types';
import { Video } from '@/features/cms/components/Video';
import { Heading, Divider } from '@/components/ui';

interface AnnouncementSectionProps {
  announcement: Announcement;
}

export function AnnouncementSection({
  announcement,
}: AnnouncementSectionProps) {
  if (!announcement.isVisible) return null;

  return (
    <div className='text-center'>
      {announcement.title ? (
        <>
          <Heading
            as='h2'
            className='text-3xl font-bold font-sans tracking-normal mb-2.5'
          >
            {announcement.title}
          </Heading>
          <Divider
            alignment='horizontal'
            color='humanoid'
            width='24'
            height='1'
          />
        </>
      ) : null}

      {announcement.description ? (
        <div
          className='mb-2.5 prose'
          dangerouslySetInnerHTML={{ __html: announcement.description }}
        />
      ) : null}

      {announcement.mediaType === 'image' && announcement.image ? (
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

      {announcement.mediaType === 'video' && announcement.videoUrl ? (
        <Video
          url={announcement.videoUrl}
          title={announcement.title || 'YouTube Video PML'}
          autoplay
          controls
          mute
        />
      ) : null}
    </div>
  );
}
