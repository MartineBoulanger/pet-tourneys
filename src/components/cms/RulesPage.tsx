import { getAllRules } from '@/mongoDB/actions/rules';
import { Rule } from '@/mongoDB/types';
import { Heading, Paragraph } from '@/components/ui';

export const RulesPage = async () => {
  const rules = await getAllRules();

  if (!rules) return <Paragraph>Loading rules...</Paragraph>;

  return (
    <div className='space-y-2.5 bg-light-grey p-2.5 rounded-lg shadow-md'>
      {rules.length > 0 ? (
        rules
          .sort((a: Rule, b: Rule) => a.order - b.order)
          .map((rule: Rule, index: number) => (
            <div key={index} className='bg-background p-2.5 lg:p-5 rounded-lg'>
              <Heading
                as='h2'
                className='font-sans text-2xl font-bold text-humanoid mb-2.5'
              >
                {rule.title}
              </Heading>
              <div
                className='rules'
                dangerouslySetInnerHTML={{ __html: rule.content }}
              />
            </div>
          ))
      ) : (
        <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
          {'No rules are yet set, come back later.'}
        </Paragraph>
      )}
    </div>
  );
};
