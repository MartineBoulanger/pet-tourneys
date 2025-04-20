'use client';

import { useState } from 'react';
import { BattleLogViewerProps, BattleRound } from '@/types';
import { ROUNDS_PER_PAGE } from '@/types/constants';

export function BattleLogViewer({ battleLog }: BattleLogViewerProps) {
  // Assert that battle is an array of BattleRound
  const battleRounds = battleLog.battle as unknown as BattleRound[];
  const [expandedRounds, setExpandedRounds] = useState<Record<number, boolean>>(
    {}
  );
  const [visibleRounds, setVisibleRounds] = useState(ROUNDS_PER_PAGE);

  const toggleRound = (round: number) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [round]: !prev[round],
    }));
  };

  // Now use battleRounds instead of battleLog.battle everywhere
  const showMoreRounds = () => {
    setVisibleRounds((prev) =>
      Math.min(prev + ROUNDS_PER_PAGE, battleRounds.length)
    );
  };

  const showLessRounds = () => {
    setVisibleRounds((prev) =>
      Math.max(ROUNDS_PER_PAGE, prev - ROUNDS_PER_PAGE)
    );
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className='rounded-lg overflow-hidden shadow-md'>
      {/* Battle Header */}
      <div className='bg-light-grey p-4'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='font-medium'>
              {'Battle on '}
              {formatTimestamp(battleLog.timestamp)}
            </h3>
            <div className='flex items-center mt-1'>
              <span
                className={`text-sm px-2 py-1 rounded mr-2 ${
                  battleLog.result === 'WIN'
                    ? 'bg-green-100 text-green-800'
                    : battleLog.result === 'LOSS'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {battleLog.result}
              </span>
              <span className='text-sm px-2 py-1 rounded text-foreground bg-medium-grey'>
                {battleLog.duration}
                {' • '}
                {battleLog.rounds}
                {' rounds'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-light-grey bg-dark-grey'>
        <div>
          <h4 className='font-medium text-blue mb-2'>{'Log Owner Team'}</h4>
          <ul className='space-y-1'>
            {battleLog.player_team.map((pet, index) => (
              <li key={index} className='flex items-center'>
                <span>{pet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className='font-medium text-red mb-2'>{'Opponent Team'}</h4>
          <ul className='space-y-1'>
            {battleLog.opponent_team.map((pet, index) => (
              <li key={index} className='flex items-center'>
                <span>{pet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rounds */}
      <div className='p-4 bg-dark-grey'>
        <h4 className='font-medium mb-3'>{'Battle Rounds'}</h4>
        <div className='space-y-2'>
          {battleRounds.slice(0, visibleRounds).map((round) => (
            <div key={round.round} className='rounded-md overflow-hidden'>
              <button
                onClick={() => toggleRound(round.round)}
                className='w-full flex justify-between items-center p-3 bg-light-grey hover:bg-medium-grey rounded-none'
              >
                <span className='font-medium'>
                  {'Round '}
                  {round.round}
                </span>
                <span className='text-gray-500'>
                  {expandedRounds[round.round] ? '−' : '+'}
                </span>
              </button>

              {expandedRounds[round.round] && (
                <div className='p-3 pt-0 border border-light-grey rounded-b-md'>
                  <ul className='space-y-2'>
                    {round.events.map((event, index) => {
                      // Remove the round number from the beginning of each event
                      const cleanedEvent = event.replace(/^\d+\s*/, '');

                      const isPlayer = event.includes('your');
                      const isEnemy = event.includes('enemy');
                      const hasDodged = event.includes('dodged');
                      const hasBlocked = event.includes('blocked');
                      const hasMissed = event.includes('missed');
                      const isDamage = event.includes('damage');
                      const isCritical = event.includes('Critical');
                      const isStrong = event.includes('Strong');

                      return (
                        <li
                          key={index}
                          className={`text-sm ${
                            isPlayer
                              ? 'text-blue'
                              : isEnemy
                              ? 'text-red'
                              : 'text-gray-500'
                          }`}
                        >
                          <div className='flex items-start'>
                            {cleanedEvent.split('[').map((part, i) => {
                              if (i === 0) return part;
                              const [ability, rest] = part.split(']');
                              return (
                                <span key={i}>
                                  <span className='font-bold'>[{ability}]</span>
                                  {rest}
                                </span>
                              );
                            })}
                            {isDamage && (
                              <span
                                className={`ml-1 px-1 rounded text-xs ${
                                  isCritical
                                    ? 'bg-red-100 text-red-800'
                                    : isStrong
                                    ? 'bg-blue-100 text-blue-800'
                                    : hasMissed
                                    ? 'bg-cyan-100 text-cyan-800'
                                    : hasDodged
                                    ? 'bg-purple-100 text-purple-800'
                                    : hasBlocked
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {isCritical
                                  ? 'CRIT'
                                  : isStrong
                                  ? 'STRONG'
                                  : hasMissed
                                  ? 'MISS'
                                  : hasDodged
                                  ? 'DODGE'
                                  : hasBlocked
                                  ? 'BLOCK'
                                  : 'ATTACK'}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More/Less Buttons */}
        <div className='flex justify-center gap-4 mt-4'>
          {visibleRounds < battleRounds.length && (
            <button onClick={showMoreRounds} className='btn-submit'>
              Show More
            </button>
          )}
          {visibleRounds > ROUNDS_PER_PAGE && (
            <button onClick={showLessRounds} className='btn-inverted'>
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
