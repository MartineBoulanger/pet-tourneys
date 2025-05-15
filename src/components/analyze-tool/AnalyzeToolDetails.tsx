'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { DownloadPDFProps } from './types';
import { AbilityCategories } from '@/utils/types';
import { Heading, Paragraph } from '@/components/ui';
import {
  calculateAverageDuration,
  getMostUsedPets,
  analyzeUsedAbilities,
  abilitiesCategoryNames,
  parseBattleStatistics,
} from '@/utils/analyzeToolHelpers';
import { cn } from '@/utils/cn';
import { GeneratePDF } from './GeneratePDF';

export const AnalyzeToolDetails = ({
  parsedBattleLogs,
  parsedPetUsage,
  playerName,
}: DownloadPDFProps) => {
  const battleStats = parseBattleStatistics(parsedBattleLogs);
  const usedAbilities = analyzeUsedAbilities(parsedBattleLogs);

  // Safe default values for all stats
  const safeStats = {
    ...battleStats,
    totalPetSwaps: battleStats.totalPetSwaps || { player: 0, opponent: 0 },
    petSwapDetails: battleStats.petSwapDetails || {},
    weatherChanges: battleStats.weatherChanges || { total: 0, byType: {} },
    totalWeatherChanges: battleStats.totalWeatherChanges || 0,
    totalDeaths: battleStats.totalDeaths || 0,
    totalKills: battleStats.totalDeaths || 0,
    petPerformance: battleStats.petPerformance || {},
  };

  return (
    parsedBattleLogs.length > 0 && (
      <div className='mt-10'>
        {/* Title & action button */}
        <div className='flex justify-between items-center mb-5'>
          <Heading as='h2' className='text-2xl font-bold'>
            {'Battle Logs Analysis Report'}
          </Heading>
          <PDFDownloadLink
            document={
              <GeneratePDF
                parsedBattleLogs={parsedBattleLogs}
                parsedPetUsage={parsedPetUsage}
                playerName={playerName}
              />
            }
            fileName={`${playerName + '-' || ''}battle-logs-analysis.pdf`}
            className='btn-submit py-2 px-4 rounded border-none uppercase'
          >
            {({ loading }) =>
              loading ? 'Preparing PDF...' : 'Download as PDF'
            }
          </PDFDownloadLink>
        </div>

        {/* Analysis results */}
        <div
          id='analysis-results'
          className='bg-light-grey p-5 rounded-lg shadow-md'
        >
          {playerName && (
            <Heading as='h3' className='text-2xl mb-5 text-center'>
              <span>{'Logs from '}</span>
              <span className='font-bold text-light-blue'>{playerName}</span>
            </Heading>
          )}

          {parsedBattleLogs && parsedBattleLogs.length > 0 && (
            <div className='mb-10'>
              <Heading as='h4' className='text-xl font-semibold mb-2'>
                {'Total Logs Overview'}
              </Heading>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>
                    {'Total Battles'}
                  </Paragraph>
                  <Paragraph className='text-4xl font-bold text-light-blue'>
                    {parsedBattleLogs.length}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey  p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>{'Wins'}</Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {parsedBattleLogs.filter((b) => b.result === 'WIN').length}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>{'Losses'}</Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {parsedBattleLogs.filter((b) => b.result === 'LOSS').length}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>{'Draws'}</Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {parsedBattleLogs.filter((b) => b.result === 'DRAW').length}
                  </Paragraph>
                </div>
              </div>

              <div className='mb-4 flex gap-2.5'>
                <Heading as='h4'>{'Average Battle Duration:'}</Heading>
                <Paragraph className='text-light-blue font-bold'>
                  {calculateAverageDuration(parsedBattleLogs)}
                </Paragraph>
              </div>
            </div>
          )}

          {parsedBattleLogs && parsedBattleLogs.length > 0 && (
            <div className='mb-10'>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Battle Logs Overview'}
              </Heading>
              <div className='space-y-5'>
                {parsedBattleLogs.map((battle, i) => (
                  <div
                    key={i}
                    className='bg-dark-grey p-4 rounded-lg shadow-md'
                  >
                    <div className='flex justify-between mb-2'>
                      <Paragraph className='font-bold'>
                        <span>{`Battle ${i + 1} - `}</span>
                        <span className='text-light-blue'>
                          {new Date(battle.timestamp).toLocaleString()}
                        </span>
                      </Paragraph>
                      <Paragraph
                        className={`text-sm px-2 py-1 rounded ${
                          battle.result === 'WIN'
                            ? 'bg-light-green text-dark-green'
                            : battle.result === 'LOSS'
                            ? 'bg-light-red text-dark-red'
                            : 'bg-light-yellow text-dark-yellow'
                        }`}
                      >
                        {battle.result}
                      </Paragraph>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <Paragraph className='font-medium text-cyan mb-2'>
                          {'Your Team'}
                        </Paragraph>
                        <ul className='list-disc pl-5'>
                          {battle.player_team?.map((pet, j) => (
                            <li key={j}>{pet}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Paragraph className='font-medium text-purple mb-2'>
                          {'Opponent Team'}
                        </Paragraph>
                        <ul className='list-disc pl-5'>
                          {battle.opponent_team?.map((pet, j) => (
                            <li key={j}>{pet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Paragraph className='text-sm py-1 px-2 bg-light-grey w-fit rounded mt-2.5'>
                      <span>
                        {'Duration: '}
                        {battle.duration}
                      </span>
                      <span>{' • '}</span>
                      <span>
                        {'Rounds: '}
                        {battle.rounds}
                      </span>
                    </Paragraph>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='mb-10'>
            <Heading as='h4' className='text-lg font-bold mb-2.5'>
              {'Top 8 Most Used Pets'}
            </Heading>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-2.5'>
              {getMostUsedPets(parsedBattleLogs).map((pet, i) => (
                <div
                  key={i}
                  className='bg-dark-grey p-2 rounded-lg text-sm shadow-md'
                >
                  {pet.name} ({pet.count})
                </div>
              ))}
            </div>
          </div>

          {parsedPetUsage.length > 0 && (
            <div className='mb-10'>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Pet Usage List'}
              </Heading>
              <div className='overflow-x-auto'>
                <table className='border-collapse border border-medium-grey min-w-full bg-dark-grey'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Pet'}
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Type'}
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Breeds'}
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Played Per Breed'}
                      </th>
                      <th className='py-2 px-4 text-left'>{'Total Played'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPetUsage.map((pet, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0 ? 'bg-light-grey' : 'bg-medium-grey'
                        }
                      >
                        <td
                          className={cn(
                            'py-2 px-4',
                            i % 2 === 0
                              ? 'bg-light-grey border-r border-r-medium-grey'
                              : 'bg-medium-grey border-r border-r-light-grey'
                          )}
                        >
                          {pet.pet_data.name}
                        </td>
                        <td
                          className={cn(
                            'py-2 px-4',
                            i % 2 === 0
                              ? 'bg-light-grey border-r border-r-medium-grey'
                              : 'bg-medium-grey border-r border-r-light-grey'
                          )}
                        >
                          {pet.pet_data.type}
                        </td>
                        <td
                          className={cn(
                            'py-2 px-4',
                            i % 2 === 0
                              ? 'bg-light-grey border-r border-r-medium-grey'
                              : 'bg-medium-grey border-r border-r-light-grey'
                          )}
                        >
                          {pet.pet_data.breeds.join(', ')}
                        </td>
                        <td
                          className={cn(
                            'py-2 px-4',
                            i % 2 === 0
                              ? 'bg-light-grey border-r border-r-medium-grey'
                              : 'bg-medium-grey border-r border-r-light-grey'
                          )}
                        >
                          {pet.pet_data.times_played.join(', ')}
                        </td>
                        <td className='py-2 px-4'>{pet.total_played}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {usedAbilities &&
          safeStats.totalWeatherChanges &&
          safeStats.totalDeaths ? (
            <div className='mb-10'>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Total Performance Overview'}
              </Heading>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>
                    {'Abilities Used'}
                  </Paragraph>
                  <Paragraph className='text-4xl font-bold text-light-blue'>
                    {usedAbilities.totalUniqueAbilitiesUsed}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey  p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>
                    {'Weather Changes'}
                  </Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {safeStats.totalWeatherChanges}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>{'Pet Deaths'}</Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {safeStats.totalDeaths}
                  </Paragraph>
                </div>
                <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                  <Paragraph className='font-medium'>{'Pet Kills'}</Paragraph>
                  <Paragraph className='text-4xl text-light-blue font-bold'>
                    {safeStats.totalKills}
                  </Paragraph>
                </div>
              </div>
            </div>
          ) : null}

          {safeStats.petPerformance &&
            Object.keys(safeStats.petPerformance).length > 0 && (
              <div className='mb-10'>
                <Heading as='h4' className='text-lg font-bold mb-2'>
                  {'Pet Performance Overview'}
                </Heading>
                <table className='border-collapse border border-medium-grey min-w-full bg-dark-grey'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Pet'}
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Kills'}
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        {'Deaths'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(safeStats.petPerformance)
                      .filter(([pet]) => pet)
                      .sort((a, b) => (b[1]?.kills || 0) - (a[1]?.kills || 0))
                      .map(([pet, performance], index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-light-grey' : 'bg-medium-grey'
                          }
                        >
                          <td
                            className={cn(
                              'py-2 px-4',
                              index % 2 === 0
                                ? 'bg-light-grey border-r border-r-medium-grey'
                                : 'bg-medium-grey border-r border-r-light-grey'
                            )}
                          >
                            {pet}
                          </td>
                          <td
                            className={cn(
                              'py-2 px-4',
                              index % 2 === 0
                                ? 'bg-light-grey border-r border-r-medium-grey'
                                : 'bg-medium-grey border-r border-r-light-grey'
                            )}
                          >
                            {performance?.kills || 0}
                          </td>
                          <td
                            className={cn(
                              'py-2 px-4',
                              index % 2 === 0
                                ? 'bg-light-grey border-r border-r-medium-grey'
                                : 'bg-medium-grey border-r border-r-light-grey'
                            )}
                          >
                            {performance?.deaths || 0}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

          {safeStats.totalPetSwaps &&
            Object.keys(safeStats.totalPetSwaps).length > 0 && (
              <div className='mb-10'>
                <Heading as='h4' className='text-lg font-bold mb-2'>
                  {'Pet Swaps Overview'}
                </Heading>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                  <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                    <Paragraph className='font-medium'>
                      {'Total Swaps Player'}
                    </Paragraph>
                    <Paragraph className='text-4xl font-bold text-light-blue'>
                      {safeStats.totalPetSwaps.player}
                    </Paragraph>
                  </div>
                  <div className='bg-dark-grey  p-4 rounded-lg shadow-md'>
                    <Paragraph className='font-medium'>
                      {'Total Swaps Opponent'}
                    </Paragraph>
                    <Paragraph className='text-4xl text-light-blue font-bold'>
                      {safeStats.totalPetSwaps.opponent}
                    </Paragraph>
                  </div>
                </div>
              </div>
            )}

          {safeStats.petSwapDetails &&
            Object.keys(safeStats.petSwapDetails).length > 0 && (
              <div className='mb-10'>
                <Heading as='h4' className='text-lg font-bold mb-2'>
                  {'Pet Swaps List'}
                </Heading>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2.5'>
                  {Object.entries(safeStats.petSwapDetails)
                    .sort((a, b) => b[1] - a[1])
                    .map(([pet, totalSwaps], index) => (
                      <div
                        key={index}
                        className='bg-dark-grey p-2 rounded-lg text-sm shadow-md'
                      >
                        {pet} ({totalSwaps})
                      </div>
                    ))}
                </div>
              </div>
            )}

          {usedAbilities && (
            <div className='mb-10'>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Total Abilities Overview'}
              </Heading>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                {(
                  Object.entries(usedAbilities) as [
                    keyof AbilityCategories,
                    string[]
                  ][]
                )
                  .filter(([_, abilities]) => abilities && abilities.length > 0)
                  .map(([category, count], index) => {
                    const categoryName = abilitiesCategoryNames[category];
                    return (
                      <div
                        className='bg-dark-grey p-4 rounded-lg shadow-md'
                        key={index}
                      >
                        <Paragraph className='font-medium'>
                          {categoryName}
                        </Paragraph>
                        <Paragraph className='text-4xl font-bold text-light-blue'>
                          {count.length}
                        </Paragraph>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {safeStats.weatherChanges &&
            Object.keys(safeStats.weatherChanges).length > 0 && (
              <div className='mb-10'>
                <Heading as='h4' className='text-lg font-bold mb-2'>
                  {'Weather Changes Overview'}
                </Heading>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                  {Object.entries(safeStats.weatherChanges.byType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([weather, count], index) => (
                      <div
                        className='bg-dark-grey p-4 rounded-lg shadow-md'
                        key={index}
                      >
                        <Paragraph className='font-medium'>{weather}</Paragraph>
                        <Paragraph className='text-4xl font-bold text-light-blue'>
                          {count}
                        </Paragraph>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {usedAbilities && (
            <div>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Abilities Usage Lists'}
              </Heading>
              {(
                Object.entries(usedAbilities) as [
                  keyof AbilityCategories,
                  string[]
                ][]
              )
                .filter(([_, abilities]) => abilities && abilities.length > 0)
                .map(([category, abilities], index) => (
                  <div key={index} className='mb-5 last-of-type:mb-0'>
                    <Heading
                      as='h5'
                      className='text-md font-bold text-light-blue mb-2'
                    >
                      {abilitiesCategoryNames[category]}
                    </Heading>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2.5'>
                      {abilities.map((ability, i) => (
                        <div
                          key={i}
                          className='bg-dark-grey p-2 rounded-lg text-sm shadow-md'
                        >
                          {ability}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Title & action button */}
        <div className='flex justify-between items-center mt-5'>
          <Heading as='h2' className='text-2xl font-bold'>
            {'Battle Logs Analysis Report'}
          </Heading>
          <PDFDownloadLink
            document={
              <GeneratePDF
                parsedBattleLogs={parsedBattleLogs}
                parsedPetUsage={parsedPetUsage}
                playerName={playerName}
              />
            }
            fileName={`${playerName + '-' || ''}battle-logs-analysis.pdf`}
            className='btn-submit py-2 px-4 rounded border-none uppercase'
          >
            {({ loading }) =>
              loading ? 'Preparing PDF...' : 'Download as PDF'
            }
          </PDFDownloadLink>
        </div>
      </div>
    )
  );
};
