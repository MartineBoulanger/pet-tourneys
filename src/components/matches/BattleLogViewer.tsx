'use client';

import { useState } from 'react';
import { ROUNDS_PER_PAGE } from '@/utils/constants';
import { Heading, Button } from '@/components/ui';
import { BattleLog, BattleRound } from '@/utils/types';

interface BattleLogViewerProps {
  battleLog: BattleLog;
}

export function BattleLogViewer({ battleLog }: BattleLogViewerProps) {
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
      <div className='bg-light-grey p-2.5 sm:p-5'>
        <div className='flex justify-between items-center'>
          <div>
            <Heading as='h3' className='font-medium'>
              {'Battle on '}
              {formatTimestamp(battleLog.timestamp)}
            </Heading>
            <div className='flex items-center mt-2.5'>
              <span
                className={`text-sm px-2 py-1 rounded mr-2.5 ${
                  battleLog.result === 'WIN'
                    ? 'bg-green-100 text-green-800'
                    : battleLog.result === 'LOSS'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {battleLog.result}
              </span>
              <span className='text-sm px-2 py-1 rounded text-foreground bg-background'>
                {battleLog.duration}
                {' • '}
                {battleLog.rounds}
                {' rounds'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-2.5 sm:p-5 border-b border-light-grey bg-background'>
        <div>
          <Heading as='h4' className='font-medium text-cyan-400 mb-2.5'>
            {'Log Owner Team'}
          </Heading>
          <ul className='space-y-1'>
            {battleLog.player_team.map((pet, index) => (
              <li key={index} className='flex items-center'>
                <span>{pet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Heading as='h4' className='font-medium text-purple-400 mb-2.5'>
            {'Opponent Team'}
          </Heading>
          <ul className='space-y-1'>
            {battleLog.opponent_team.map((pet, index) => (
              <li key={index} className='flex items-center'>
                <span>{pet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='p-2.5 sm:p-5 bg-background'>
        <Heading as='h4' className='font-medium mb-2.5'>
          {'Battle Rounds'}
        </Heading>
        <div className='space-y-2.5 sm:space-y-5'>
          {battleRounds.slice(0, visibleRounds).map((round) => (
            <div key={round.round} className='rounded-md overflow-hidden'>
              <Button
                onClick={() => toggleRound(round.round)}
                className='w-full p-2.5 sm:p-5 bg-light-grey hover:bg-medium-grey rounded-none'
                title='Toggle round'
                aria-label='Toggle round'
              >
                <span className='flex justify-between items-center'>
                  <span className='font-medium'>
                    {'Round '}
                    {round.round}
                  </span>
                  <span>{expandedRounds[round.round] ? '−' : '+'}</span>
                </span>
              </Button>

              {expandedRounds[round.round] && (
                <div className='p-2.5 sm:p-5 border border-light-grey bg-dark-grey rounded-b-md'>
                  <ul className='space-y-2.5 sm:space-y-5'>
                    {round.events.map((event, index) => {
                      const cleanedEvent = event.replace(/^\d+\s*/, '');

                      const isPlayer = event.includes('your');
                      const isEnemy = event.includes('enemy');
                      const isDead = event.includes('died');
                      const isDodged = event.includes('dodged');
                      const isBlocked = event.includes('blocked');
                      const isMissed = event.includes('missed');
                      const isCritical = event.includes('Critical');
                      const isStrong = event.includes('Strong');
                      const isWeak = event.includes('Weak');

                      return (
                        <li
                          key={index}
                          className={`text-sm sm:text-base ${
                            isPlayer
                              ? 'text-cyan-400'
                              : isEnemy
                              ? 'text-purple-400'
                              : isDead
                              ? 'text-light-red'
                              : 'text-orange-300'
                          }`}
                        >
                          <div className='flex items-center justify-between w-full md:max-w-[640px]'>
                            <span>{cleanedEvent}</span>
                            {isStrong ||
                            isWeak ||
                            isCritical ||
                            isDodged ||
                            isBlocked ||
                            isMissed ? (
                              <span
                                className={`ml-1 px-1 rounded text-xs sm:text-sm ml-2.5 ${
                                  isCritical || isMissed
                                    ? 'bg-red-100 text-red-800'
                                    : isStrong || isDodged
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {isCritical
                                  ? 'CRIT'
                                  : isStrong
                                  ? 'STRONG'
                                  : isWeak
                                  ? 'WEAK'
                                  : isDodged
                                  ? 'DODGE'
                                  : isBlocked
                                  ? 'BLOCK'
                                  : 'MISS'}
                              </span>
                            ) : null}
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

        <div className='flex justify-center gap-2.5 sm:gap-5 mt-2.5 sm:mt-5'>
          {visibleRounds < battleRounds.length && (
            <Button
              onClick={showMoreRounds}
              title='Show More'
              aria-label='Show More'
            >
              Show More
            </Button>
          )}
          {visibleRounds > ROUNDS_PER_PAGE && (
            <Button
              onClick={showLessRounds}
              className='btn-inverted'
              title='Show Less'
              aria-label='Show Less'
            >
              Show Less
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
