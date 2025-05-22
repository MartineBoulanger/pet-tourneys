import { BattleAnalysisStatsProps } from './types';
import { abilitiesCategoryNames } from '@/utils/analyzeToolHelpers';

export function BattleLogsStats({
  stats,
  // isMatchView,
}: BattleAnalysisStatsProps) {
  return (
    <div className='space-y-8'>
      {/* Most Used Pets */}
      {/* <section className='bg-card p-6 rounded-lg'>
        <h2 className='text-xl font-bold mb-4'>{'Most Used Pets'}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.petStats.map((pet) => (
            <div key={pet.name} className='border p-4 rounded-lg flex flex-col'>
              <h3 className='font-semibold'>{pet.name}</h3>
              <p>
                {'Total uses: '}
                {pet.count}
              </p>
              <p>
                {'Team: '}
                {pet.team === 'both'
                  ? 'Both'
                  : pet.team === 'player'
                  ? 'Player'
                  : 'Opponent'}
              </p>
              {pet.team !== 'opponent' && (
                <p>
                  {'Player uses: '}
                  {pet.playerCount}
                </p>
              )}
              {pet.team !== 'player' && (
                <p>
                  {'Opponent uses: '}
                  {pet.opponentCount}
                </p>
              )}
            </div>
          ))}
        </div>
      </section> */}

      {/* Battle Mechanics */}
      {/* <section className='bg-card p-6 rounded-lg'>
        <h2 className='text-xl font-bold mb-4'>{'Battle Mechanics'}</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h3 className='text-lg font-semibold mb-2'>{'Weather Changes'}</h3>
            <div className='space-y-2'>
              {Object.entries(stats.battleStats.weatherChanges.byType).map(
                ([weather, count]) => (
                  <div key={weather} className='flex justify-between'>
                    <span>{weather}:</span>
                    <span>
                      {count} (
                      {Math.round(
                        (count / stats.battleStats.weatherChanges.total) * 100
                      )}
                      {'%'})
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-2'>
              {'Top Performing Pets'}
            </h3>
            <div className='space-y-2'>
              {Object.entries(stats.battleStats.petPerformance)
                .sort((a, b) => b[1].kills - a[1].kills)
                .slice(0, 5)
                .map(([pet, { kills, deaths }]) => (
                  <div key={pet} className='flex justify-between'>
                    <span>{pet}:</span>
                    <span>
                      {kills}
                      {' kills / '}
                      {deaths}
                      {' deaths (K/D: '}
                      {(kills / Math.max(1, deaths)).toFixed(2)}
                      {')'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* <div className='bg-card p-6 rounded-lg mt-4'>
        <h2 className='text-xl font-bold mb-4'>{'Ability Insights'}</h2>
        <p>
          {'Total unique abilities used: '}
          {stats.abilityStats.totalUniqueAbilitiesUsed || 0}
        </p>
      </div> */}

      {/* Ability Analysis */}
      <section className='bg-card p-6 rounded-lg'>
        <h2 className='text-xl font-bold mb-4'>{'Ability Analysis'}</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Object.entries(stats.abilityStats)
            .filter(
              ([key]) =>
                key !== 'categorizationLog' &&
                key !== 'totalUniqueAbilitiesUsed'
            )
            .filter(([_, abilities]) => abilities && abilities.length > 0)
            .map(([category, abilities]) => {
              // Type guard to ensure we're dealing with an ability category
              if (Array.isArray(abilities)) {
                return (
                  <div key={category} className='border p-3 rounded-lg'>
                    <h3 className='font-semibold'>
                      {abilitiesCategoryNames[
                        category as keyof typeof abilitiesCategoryNames
                      ] || category}
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      {abilities.length}
                      {' ability'}
                      {abilities.length !== 1 ? 'ies' : ''}
                    </p>
                    <div className='mt-2 space-y-1'>
                      {abilities.slice(0, 3).map((ability) => (
                        <p key={ability} className='text-sm'>
                          {ability}
                        </p>
                      ))}
                      {abilities.length > 3 && (
                        <p className='text-sm text-muted-foreground'>
                          {'+'}
                          {abilities.length - 3}
                          {' more...'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </section>
    </div>
  );
}

// function StatCard({ title, value }: { title: string; value: string }) {
//   return (
//     <div className='border p-4 rounded-lg'>
//       <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
//       <p className='text-2xl font-bold'>{value}</p>
//     </div>
//   );
// }
