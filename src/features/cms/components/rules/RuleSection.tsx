import { Rule as RuleType } from '@/features/cms/types';
import { Heading, Paragraph, Divider } from '@/components/ui';
import { ImageGrid } from '../ImageGrid';

interface RuleSectionProps {
  rule: RuleType;
}

export function RuleSection({ rule }: RuleSectionProps) {
  // Ensure images is always an array
  const images = Array.isArray(rule.images) ? rule.images : [];

  return (
    <section className='space-y-2.5 lg:space-y-5'>
      {/* Section header */}
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading as='h2' className='mb-2.5 mx-auto text-foreground/90'>
          {rule.title}
        </Heading>
        <Divider
          alignment='horizontal'
          color='humanoid'
          width='24'
          height='1'
        />
        <div
          className='mt-2.5 text-left prose'
          dangerouslySetInnerHTML={{ __html: rule.content }}
        />
        {images.length > 0 && (
          <div className='mt-2.5'>
            <Divider
              alignment='horizontal'
              color='light-grey'
              width='10'
              height='0.5'
            />
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
