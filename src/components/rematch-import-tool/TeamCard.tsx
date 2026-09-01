import { Heading, Paragraph } from '../ui';
import { CopyButton } from './CopyButton';
import { PetSlot } from './PetSlot';
import { TeamCardProps } from '@/types/rematch-import.types';

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className='bg-card p-2.5 lg:p-5 bg-light-grey'>
      <div className='rounded-full w-full h-0.5 mb-5 mx-auto bg-medium-grey' />
      <div className='flex flex-wrap items-baseline justify-between gap-2.5'>
        <Heading as='h3' className='font-bold'>
          {team.name}

          {team.hasScript && (
            <span className='ml-2.5 inline-block rounded bg-light-green text-dark-green px-1.5 py-0.5 align-middle text-xs'>
              {'has script'}
            </span>
          )}
        </Heading>

        {team.npcId !== null ? (
          <Paragraph className='text-xs text-foreground/80'>
            {'NPC '}
            <span className='font-semibold text-humanoid'>{team.npc}</span>
            {` · `}
            <span className='font-semibold text-humanoid'>{team.npcId}</span>
            {team.extraTargets > 0 &&
              ` · +${team.extraTargets} more ${team.extraTargets === 1 ? 'target' : 'targets'}`}
          </Paragraph>
        ) : (
          <Paragraph className='text-xs text-foreground/80'>
            {'no target'}
          </Paragraph>
        )}
      </div>

      <div className='my-2.5 flex flex-wrap items-center gap-2.5'>
        {team.petTags.map((pet, index) => (
          <PetSlot key={`${team.id}-${index}`} value={pet} />
        ))}

        <span className='text-xs text-foreground/80'>
          {'abilities · breed · species'}
        </span>
      </div>

      <div className='flex items-stretch gap-2.5 flex-row'>
        <pre className='min-w-0 flex-1 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-background p-2.5 text-sm max-h-16'>
          {team.importString}
        </pre>

        <CopyButton text={team.importString} variant='inverted'>
          {'Copy'}
        </CopyButton>
      </div>
    </div>
  );
}
