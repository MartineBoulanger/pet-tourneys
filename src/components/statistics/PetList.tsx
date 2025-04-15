import { PetListProps } from '@/types';

export function PetList({ stats, matchView = false }: PetListProps) {
  return (
    <div className='bg-light-grey shadow-md rounded-lg p-4'>
      <h2 className='text-xl mb-4'>
        {matchView ? 'Match Pet Usage' : 'Tournament Pet Usage'}
      </h2>
      <div className='overflow-x-auto'>
        {stats && stats.length > 0 ? (
          <table className='min-w-full divide-y divide-dark-grey'>
            <thead className='bg-dark-grey'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                  Pet Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                  Breed/Stats
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                  Times Played
                </th>
                {!matchView && (
                  <>
                    <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                      Total Played
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider'>
                      Matches
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className='bg-medium-grey divide-y divide-light-grey'>
              {stats.map((pet) => (
                <tr key={`${pet.pet_data.name}-${pet.pet_data.type}`}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-300'>
                    {pet.pet_data.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {pet.pet_data.type}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    {pet.breed_stats.map((bs, i) => (
                      <div key={i} className='mb-1'>
                        <span className='font-bold text-blue-300'>
                          {bs.breed}
                        </span>
                        : {bs.stats}
                      </div>
                    ))}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                    {pet.breed_stats.map((bs, i) => (
                      <div key={i}>{bs.times_played}</div>
                    ))}
                  </td>
                  {!matchView && (
                    <>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                        {pet.total_played}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-blue-300 font-bold'>
                        {pet.match_count}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='p-4 rounded-lg text-center'>
            {'No pet usage data available yet.'}
          </p>
        )}
      </div>
    </div>
  );
}
