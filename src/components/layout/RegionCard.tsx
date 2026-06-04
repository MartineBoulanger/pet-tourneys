import { PlayerStanding } from '@/types/supabase.types';
import { Paragraph } from '@/components/ui';
import { MedalIcon } from '@/assets/MedalIcon';
import { cn } from '@/utils/cn';

export function RegionCard({
  region,
  standings,
}: {
  region: string;
  standings: PlayerStanding[];
}) {
  return (
    <div className='bg-light-grey rounded-xl shadow-sm '>
      <div className='bg-medium-grey px-5 py-2.5 flex items-center gap-2.5 rounded-t-xl'>
        <span className='text-xs mt-0.5 font-bold uppercase tracking-widest'>
          {'Region'}
        </span>
        <span
          className={cn(
            'text-humanoid font-brutals-tilted tracking-wider',
            region.includes('NA') ? 'text-beast' : '',
            region.includes('World') ? 'text-dragonkin' : '',
          )}
        >
          {region}
        </span>
      </div>
      <div className='px-5 py-2.5 overflow-x-auto'>
        {standings.length === 0 ? (
          <Paragraph className='text-sm py-2.5'>{'No matches yet'}</Paragraph>
        ) : (
          <table className='min-w-full'>
            <tbody>
              {standings.map((s, i) => (
                <tr
                  key={s.player + i}
                  className='border-b border-foreground/70 last:border-0'
                >
                  <td className='py-2 pr-2.5 text-lg leading-none'>
                    <MedalIcon position={i + 1} className='w-4 h-4' />
                  </td>
                  <td className='py-2.5 pr-5 font-medium text-sm truncate max-w-[120px]'>
                    {s.player}
                  </td>
                  <td className='py-2.5 pr-2.5 text-center text-sm text-green/90'>
                    {`${s.wins}W`}
                  </td>
                  <td className='py-2.5 pr-2.5 text-center text-sm text-red/90'>
                    {`${s.losses}L`}
                  </td>
                  <td className='py-2.5 pl-2.5 text-right text-sm font-bold'>
                    {`${s.points}pts`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
