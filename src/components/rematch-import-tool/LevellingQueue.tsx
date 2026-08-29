import { Paragraph } from '@/components/ui';

import type { LevellingQueueProps } from '@/types/rematch-import.types';
import { CopyButton } from './CopyButton';

export function LevellingQueue({ queue, exportData }: LevellingQueueProps) {
  if (!queue) {
    return (
      <Paragraph className='py-10 text-center text-foreground'>
        {'No levelling queue was found in Rematch.lua.'}
      </Paragraph>
    );
  }

  if (!queue.pets.length) {
    return (
      <Paragraph className='py-10 text-center text-foreground'>
        {'Your levelling queue is empty.'}
      </Paragraph>
    );
  }

  if (!exportData) {
    return (
      <Paragraph className='py-10 text-center text-foreground'>
        {'Preparing levelling queue…'}
      </Paragraph>
    );
  }

  return (
    <div className='pt-5'>
      <div>
        <div className='mb-5 flex flex-wrap items-center justify-between gap-5'>
          <div>
            <Paragraph>
              {
                'In order to import this Levelling Queue import string in PetMatch, you have to click on the button "Copy Queue", and then in the addon, you go to the Levelling Queue panel and click on the "Queue" menu button at the footer of the panel, there you can click on "Import Queue" and you will see a dialog coming up where you can paste this import string into the edit box. Be aware, this import string is unique to PetMatch, and won\'t work for any other addon. If you decide to copy only a part of the import string, then always make sure you add the "PMQ1" at the top of the import string, otherwise you won\'t be able to import the levelling pets.'
              }
            </Paragraph>
            <div className='rounded-full w-20 h-1 my-5 mx-auto bg-humanoid' />
          </div>
          <Paragraph>
            <span className='font-bold text-humanoid'>
              {exportData.pets.length}
            </span>
            {` pet${exportData.pets.length === 1 ? '' : 's'} in the levelling queue`}
          </Paragraph>

          <CopyButton text={exportData.string}>{'Copy queue'}</CopyButton>
        </div>

        {exportData.missingTypes.length > 0 && (
          <Paragraph className='rounded-lg bg-background p-2.5 text-center text-foreground shadow-md'>
            {'No pet type was found for species: '}
            {exportData.missingTypes.join(', ')}
          </Paragraph>
        )}

        <pre className='max-h-[300px] overflow-auto whitespace-pre-wrap break-all rounded-lg bg-light-grey p-5 text-sm text-foreground'>
          {exportData.string}
        </pre>
      </div>
    </div>
  );
}
