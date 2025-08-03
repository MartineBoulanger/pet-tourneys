'use client';

import { iRuleDocument } from '@/mongoDB/types';
import { createRule } from '@/mongoDB/actions/rules';
import { RuleItem } from './RuleItem';
import { Button, Paragraph } from '@/components/ui';
import { MdOutlinePostAdd } from 'react-icons/md';

export function RulesList({ rules }: { rules: iRuleDocument[] }) {
  if (!rules) return <div>Loading rules...</div>;

  return (
    <div className='space-y-4'>
      <Button
        onClick={async () => await createRule()}
        className='hover:bg-blue-grey flex items-center justify-center gap-0.5'
      >
        <MdOutlinePostAdd className='w-5 h-5' /> <span>{'Add Rule'}</span>
      </Button>

      <div className='space-y-2.5 bg-light-grey p-2.5 rounded-lg shadow-md'>
        {rules.length > 0 ? (
          rules
            .sort((a, b) => a.order - b.order)
            .map((rule, index) => <RuleItem key={index} rule={rule} />)
        ) : (
          <Paragraph className='p-2.5 lg:p-5 rounded-lg bg-background text-center shadow-md'>
            {'No rules are set yet, please add a rule.'}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
