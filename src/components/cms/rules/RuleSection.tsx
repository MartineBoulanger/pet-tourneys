import { Rule } from '@/types/supabase.types';
import { Heading, Paragraph } from '@/components/ui';
import { ImageGrid } from '@/components/layout/ImageGrid';

export function RuleSection({ rule }: { rule: Rule }) {
  // Ensure images is always an array
  const images = Array.isArray(rule.images) ? rule.images : [];

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      {/* Section header */}
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='mb-2.5 mx-auto text-foreground/90'>
          {rule.title}
        </Heading>
        <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
        <div
          className='mt-2.5 text-left prose'
          dangerouslySetInnerHTML={{ __html: rule.content }}
        />
        {images.length > 0 && (
          <div className='mt-2.5'>
            <div className='rounded-full w-10 h-0.5 my-5 mx-auto bg-light-grey' />
            <Paragraph className='text-foreground/50 my-5'>
              {images.length || 0}
              {' image'}
              {images.length !== 1 ? 's' : ''}
            </Paragraph>
          </div>
        )}
        {/* Images grid */}
        {images.length > 0 ? <ImageGrid images={images} /> : null}
      </div>
    </section>
  );
}
