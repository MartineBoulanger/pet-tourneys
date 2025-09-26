'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaFileDownload } from 'react-icons/fa';
import { Heading, Paragraph } from '@/components/ui';
import { AbilityCategories } from '@/features/supabase/types';
import {
  calculateAverageDuration,
  getMostUsedPets,
  analyzeUsedAbilities,
  parseBattleStatistics,
  transformPetSwapData,
} from '@/features/supabase/utils/analyzeToolHelpers';
import { AbilitiesCard } from '@/features/supabase/components/statistics/AbilitiesCard';
import { OverviewCard } from '@/features/supabase/components/statistics/OverviewCard';
import {
  petPerformanceLegendValues,
  petPerformanceLegendValuesColor,
  resultsColors,
  swapsColors,
  weatherColors,
} from '@/features/supabase/constants';
import { BarGraph } from '@/features/recharts-graphs/BarGraph';
import { DoubleBarGraph } from '@/features/recharts-graphs/DoubleBarGraph';
import { PieGraph } from '@/features/recharts-graphs/PieGraph';
import { RadialGraph } from '@/features/recharts-graphs/RadialGraph';
import { GeneratePDF } from './GeneratePDF';
import { DownloadPDFProps } from './types';

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

  const battleResults = [
    {
      name: 'WINS',
      value: parsedBattleLogs.filter((b) => b.result === 'WIN').length || 0,
    },
    {
      name: 'LOSSES',
      value: parsedBattleLogs.filter((b) => b.result === 'LOSS').length || 0,
    },
    {
      name: 'DRAWS',
      value: parsedBattleLogs.filter((b) => b.result === 'DRAW').length || 0,
    },
  ];

  const topUsedPets = getMostUsedPets(parsedBattleLogs, 5).map((pet) => ({
    name: pet.name,
    value: pet.count,
  }));

  const swaps = transformPetSwapData(safeStats.totalPetSwaps);
  const totalSwaps = swaps && swaps.map((t) => t.value).reduce((a, b) => a + b);

  const petSwaps = Object.entries(safeStats.petSwapDetails)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const pets =
    safeStats.petPerformance &&
    Object.entries(safeStats.petPerformance)
      .map(([petName, stats]) => ({
        name: petName,
        value1: stats.kills,
        value2: stats.deaths,
      }))
      .sort((a, b) => b.value1 - a.value1)
      .slice(0, 5);

  const weathers =
    safeStats.weatherChanges &&
    Object.entries(safeStats.weatherChanges.byType)
      .map(([type, count]) => ({
        name: type,
        value: count,
        fill: weatherColors[type] || '#303030',
      }))
      .sort((a, b) => b.value - a.value);

  return (
    parsedBattleLogs.length > 0 && (
      <div className='mt-10'>
        {/* Title & action button above the content */}
        <div className='flex flex-col lg:flex-row justify-between items-end lg:items-center mb-5'>
          <div>
            <Heading as='h2' className='text-foreground/65'>
              {'Battle Logs Analysis Report'}
            </Heading>
            <Paragraph className='max-w-[550px] italic mt-2.5 text-sm text-humanoid'>
              {
                '**Note : The charts are in most cases just showing a part of the whole data. To see all the data, download the PDF.'
              }
            </Paragraph>
          </div>
          <PDFDownloadLink
            document={
              <GeneratePDF
                parsedBattleLogs={parsedBattleLogs}
                parsedPetUsage={parsedPetUsage}
                playerName={playerName}
              />
            }
            fileName={`${playerName + '-' || ''}battle-logs-analysis.pdf`}
            className='btn-submit p-2 rounded border-none uppercase mt-5 lg:mt-0'
            title='Download as PDF'
            aria-label='Download as PDF'
          >
            {({ loading }) =>
              loading ? '...' : <FaFileDownload className='h-6 w-6' />
            }
          </PDFDownloadLink>
        </div>

        {/* Statistics results */}
        <div
          id='analysis-results'
          className='bg-light-grey p-2.5 lg:p-5 rounded-lg shadow-md lg:mb-10'
        >
          {playerName ? (
            <Heading
              as='h3'
              className='text-lg mb-5 text-center p-2.5 lg:p-5 rounded-lg bg-background flex items-center justify-center'
            >
              <span className='mr-2.5'>{'Logs from '}</span>
              <span className='text-2xl font-brutals text-humanoid'>
                {playerName}
              </span>
            </Heading>
          ) : null}

          {parsedBattleLogs && parsedBattleLogs.length > 0 && (
            <>
              <div className='mb-5'>
                <Heading as='h3' className='text-xl'>
                  {'Overall Match Statistics'}
                </Heading>
                <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-5'>
                  <OverviewCard
                    title='Total Battles'
                    value={parsedBattleLogs.length}
                  />
                  <OverviewCard
                    title='Average Battle Duration'
                    value={calculateAverageDuration(parsedBattleLogs)}
                  />
                </div>
              </div>
              <div className='mb-5'>
                <Heading as='h3' className='text-xl'>
                  {'Battle Results'}
                </Heading>
                {parsedBattleLogs && (
                  <PieGraph
                    data={battleResults.filter((m) => m.value !== 0)}
                    tooltip={'Result Count: '}
                    fillColors={resultsColors}
                  />
                )}
              </div>
            </>
          )}

          {parsedBattleLogs && parsedBattleLogs.length > 0 && (
            <div className='mb-5 lg:mb-10'>
              <Heading as='h3' className='text-xl'>
                {'Battle Logs Overview'}
              </Heading>
              <div className='space-y-2.5 lg:space-y-5'>
                {parsedBattleLogs.map((battle, i) => (
                  <div
                    key={i}
                    className='bg-background p-2.5 lg:p-5 rounded-lg shadow-md'
                  >
                    <div className='flex justify-between mb-2.5'>
                      <Paragraph>
                        <span>{`Battle ${i + 1} - `}</span>
                        <span className='text-humanoid text-sm'>
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
                    <div className='grid grid-cols-2 gap-2.5 lg:gap-5 text-sm'>
                      <div>
                        <Paragraph className='font-medium text-cyan mb-2.5'>
                          {'Your Team'}
                        </Paragraph>
                        <ul className='list-disc pl-5'>
                          {battle.player_team?.map((pet: string, j: number) => (
                            <li key={j}>{pet}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Paragraph className='font-medium text-purple mb-2.5'>
                          {'Opponent Team'}
                        </Paragraph>
                        <ul className='list-disc pl-5'>
                          {battle.opponent_team?.map(
                            (pet: string, j: number) => (
                              <li key={j}>{pet}</li>
                            )
                          )}
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

          <div className='mb-5 lg:mb-10'>
            <Heading as='h3' className='text-xl'>
              {'Top 5 Most Used Pets'}
            </Heading>
            <BarGraph
              data={topUsedPets}
              tooltip={'Played: '}
              color='#1e3a8a'
              color2='#f1f1f1'
            />
          </div>

          {safeStats.totalDeaths ? (
            <div
              className={
                Object.keys(safeStats.petPerformance).length > 0
                  ? 'mb-5'
                  : 'mb-5 lg:mb-10'
              }
            >
              <Heading as='h3' className='text-xl'>
                {'Overall Pet Performance Statistics'}
              </Heading>
              <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-5'>
                <OverviewCard
                  title='Total Pet Kills'
                  value={safeStats.totalKills}
                />
                <OverviewCard
                  title='Total Pet Deaths'
                  value={safeStats.totalDeaths}
                />
              </div>
            </div>
          ) : null}

          <div className='mb-5 lg:mb-10'>
            <Heading as='h3' className='text-xl'>
              {'Top 5 Pet Assassins'}
            </Heading>
            {battleStats.petPerformance && (
              <DoubleBarGraph
                data={pets}
                tooltip={'Kills: '}
                tooltip2={'Deaths: '}
                color={'#11a7f6'}
                color2={'#d52824'}
                fillColors={petPerformanceLegendValuesColor}
                legendValues={petPerformanceLegendValues}
                showLegend
              />
            )}
          </div>

          {safeStats.totalPetSwaps &&
            Object.keys(safeStats.totalPetSwaps).length > 0 && (
              <div className='mb-5 lg:mb-10'>
                <Heading as='h3' className='text-xl'>
                  {'Overall Pet Swaps Statistics'}
                </Heading>
                <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-5'>
                  <OverviewCard title='Total Pet Swaps' value={totalSwaps} />
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 mt-5'>
                  <div>
                    <Heading as='h3' className='text-xl'>
                      {'Pet Swaps'}
                    </Heading>
                    {safeStats.totalPetSwaps && (
                      <PieGraph
                        data={swaps}
                        tooltip={'Swaps done: '}
                        fillColors={swapsColors}
                      />
                    )}
                  </div>
                  <div>
                    <Heading as='h3' className='text-xl'>
                      {'Top 5 Pet Swaps'}
                    </Heading>
                    {battleStats.petSwapDetails && (
                      <BarGraph
                        data={petSwaps}
                        tooltip={'Total Swaps: '}
                        color='#016630'
                        color2='#f1f1f1'
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

          {safeStats.weatherChanges &&
            Object.keys(safeStats.weatherChanges).length > 0 && (
              <div className='mb-5 lg:mb-10'>
                <Heading as='h3' className='text-xl'>
                  {'Overall Weather Conditions Statistics'}
                </Heading>
                <div className='flex flex-wrap flex-col md:flex-row gap-2.5 lg:gap-5 mb-5'>
                  <OverviewCard
                    title='Total Weather Conditions'
                    value={safeStats.totalWeatherChanges}
                  />
                </div>
                <Heading as='h3' className='text-xl'>
                  {'Weather Condition Applied'}
                </Heading>
                {battleStats.weatherChanges && (
                  <RadialGraph
                    data={weathers}
                    tooltip={'Times Changed: '}
                    showLegend
                  />
                )}
              </div>
            )}

          {usedAbilities && (
            <>
              <Heading as='h3' className='text-xl'>
                {'Overall Pet Abilities Statistics'}
              </Heading>
              <div className='flex flex-wrap flex-col lg:flex-row gap-2.5 lg:gap-5 mb-5'>
                <OverviewCard
                  title='Total Unique Abilities Used'
                  value={usedAbilities.totalUniqueAbilitiesUsed || 0}
                />
              </div>
              <Heading as='h3' className='text-xl'>
                {'All Used Abilities Per Category'}
              </Heading>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 lg:gap-5'>
                {(
                  Object.entries(usedAbilities) as [
                    keyof AbilityCategories,
                    string[]
                  ][]
                )
                  .filter(([_, abilities]) => abilities && abilities.length > 0)
                  .map(([category, abilities], index) => {
                    if (Array.isArray(abilities)) {
                      return (
                        <AbilitiesCard
                          key={`${category}-${index}`}
                          category={category}
                          abilities={abilities}
                        />
                      );
                    }
                    return (
                      <p
                        key={`${category}-${index}`}
                        className='text-center bg-background rounded-lg py-5'
                      >
                        {'No abilities data available.'}
                      </p>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
};
