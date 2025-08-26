import { ImageUpload, Rule as RuleType } from '@/mongoDB/types';
import { ImageGrid } from '../ImageGrid';
import { Heading, Paragraph, Divider } from '@/components/ui';

interface RuleSectionProps {
  rule: RuleType & { images: ImageUpload[] };
}

export function RuleSection({ rule }: RuleSectionProps) {
  return (
    <section className='space-y-2.5 lg:space-y-5'>
      {/* Section header */}
      <div className='text-center bg-background rounded-lg p-2.5 lg:p-5'>
        <Heading
          as='h2'
          className='text-3xl font-bold font-sans tracking-normal mb-2.5'
        >
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
        {rule.images.length > 0 && (
          <div className='mt-2.5'>
            <Divider
              alignment='horizontal'
              color='light-grey'
              width='10'
              height='0.5'
            />
            <Paragraph className='text-foreground/50 my-5'>
              {rule.images.length}
              {' image'}
              {rule.images.length !== 1 ? 's' : ''}
            </Paragraph>
          </div>
        )}
        {/* Images grid */}
        {rule.images.length === 0 ? null : <ImageGrid images={rule.images} />}
      </div>
    </section>
  );
}
