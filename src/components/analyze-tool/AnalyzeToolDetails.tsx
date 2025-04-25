'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { DownloadPDFProps } from '@/types';
import { Heading, Paragraph } from '@/components/ui';
import {
  calculateAverageDuration,
  getMostUsedPets,
} from '@/utils/analyzeToolHelpers';
import { cn } from '@/utils/cn';
import { GeneratePDF } from './GeneratePDF';

export const AnalyzeToolDetails = ({
  parsedBattleLogs,
  parsedPetUsage,
  playerName,
}: DownloadPDFProps) => {
  return (
    parsedBattleLogs.length > 0 && (
      <div className='mt-8'>
        <div className='flex justify-between items-center mb-4'>
          <Heading as='h2' className='text-2xl font-bold'>
            {'Analyze Results'}
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

        <div
          id='analysis-results'
          className='bg-light-grey p-5 rounded-lg shadow-md'
        >
          {playerName && (
            <Heading as='h3' className='mb-5'>
              <span>{'Character name: '}</span>
              <span className='font-bold text-light-blue'>{playerName}</span>
            </Heading>
          )}

          <div className='mb-5'>
            <Heading as='h4' className='text-lg font-semibold mb-2'>
              {'Battles Overview Statistics'}
            </Heading>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
              <div className='bg-dark-grey p-4 rounded-lg shadow-md'>
                <Paragraph className='font-medium'>{'Total Battles'}</Paragraph>
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
              <Heading as='h5'>{'Average Battle Duration:'}</Heading>
              <Paragraph className='text-light-blue font-bold'>
                {calculateAverageDuration(parsedBattleLogs)}
              </Paragraph>
            </div>

            <div>
              <Heading as='h5' className='font-bold mb-2.5'>
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
          </div>

          {parsedPetUsage.length > 0 && (
            <div className='mb-5'>
              <Heading as='h4' className='text-lg font-bold mb-2'>
                {'Pet Usage Statistics'}
              </Heading>
              <div className='overflow-x-auto'>
                <table className='border-collapse border border-medium-grey min-w-full bg-dark-grey'>
                  <thead>
                    <tr>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        Pet
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        Type
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        Breeds
                      </th>
                      <th className='py-2 px-4 text-left border-r border-r-light-grey'>
                        Times Played
                      </th>
                      <th className='py-2 px-4 text-left'>Total</th>
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

          <div>
            <Heading as='h4' className='text-lg font-bold mb-2'>
              {'Battles Info Overview'}
            </Heading>
            <div className='space-y-5'>
              {parsedBattleLogs.map((battle, i) => (
                <div key={i} className='bg-dark-grey p-4 rounded-lg shadow-md'>
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
                    <span>Duration: {battle.duration}</span>
                    <span>{' • '}</span>
                    <span>Rounds: {battle.rounds}</span>
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
