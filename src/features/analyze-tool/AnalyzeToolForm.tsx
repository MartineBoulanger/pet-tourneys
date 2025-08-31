'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { parseBattleLog } from '@/features/supabase/utils/battleLogParser';
import { parsePetUsage } from '@/features/supabase/utils/petUsageParser';
import { BattleLog, PetData } from '@/features/supabase/types';
import {
  Form,
  Input,
  Textarea,
  AnalyzeToolFormSkeleton,
} from '@/components/ui';
import { AnalyzeToolDetails } from './AnalyzeToolDetails';

export const AnalyzeToolForm = () => {
  const [playerName, setPlayerName] = useState('');
  const [battleLogs, setBattleLogs] = useState('');
  const [petUsage, setPetUsage] = useState('');
  const [parsedBattleLogs, setParsedBattleLogs] = useState<BattleLog[]>([]);
  const [parsedPetUsage, setParsedPetUsage] = useState<PetData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear localStorage when navigating away
  useEffect(() => {
    const handleRouteChange = () => {
      localStorage.removeItem('petBattleAnalyzerData');
    };

    window.addEventListener('beforeunload', handleRouteChange);
    return () => {
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Parse the data
      const parsedLogs = parseBattleLog(battleLogs);
      const parsedPets = parsePetUsage(petUsage);

      // Store in state and localStorage
      setParsedBattleLogs(parsedLogs);
      setParsedPetUsage(parsedPets);

      localStorage.setItem(
        'petBattleAnalyzerData',
        JSON.stringify({
          playerName,
          battleLogs,
          petUsage,
          parsedLogs,
          parsedPets,
        })
      );

      toast.success('Logs parsed successfully!', {
        className: 'toast-success',
        description:
          'Your logs have been parsed successfully, scroll down to see all the parsed data.',
      });
    } catch (error) {
      console.error('Parsing error:', error);
      toast.error('Failed to parse logs.', {
        className: 'toast-error',
        description:
          'Please check the format of the logs, only the tournament addon logs can be parsed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPlayerName('');
    setBattleLogs('');
    setPetUsage('');
    setParsedBattleLogs([]);
    setParsedPetUsage([]);
    localStorage.removeItem('petBattleAnalyzerData');
  };

  // Load from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('petBattleAnalyzerData');
    if (savedData) {
      try {
        const { playerName, battleLogs, petUsage, parsedLogs, parsedPets } =
          JSON.parse(savedData);
        setPlayerName(playerName);
        setBattleLogs(battleLogs);
        setPetUsage(petUsage);
        setParsedBattleLogs(parsedLogs);
        setParsedPetUsage(parsedPets);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  if (!isMounted) return <AnalyzeToolFormSkeleton />;

  return (
    <>
      <div className='bg-light-grey shadow-md rounded-lg p-2.5 lg:p-5'>
        <Form
          handleSubmit={handleSubmit}
          button1={{
            variant: 'secondary',
            type: 'button',
            text: 'Clear',
          }}
          button2={{
            variant: 'primary',
            type: 'submit',
            text: isLoading ? 'Parsing...' : 'Analyze Logs',
          }}
          handleClick={handleClear}
        >
          <Input
            label='Character Name'
            id='playerName'
            name='playerName'
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder='Enter your character name'
          />
          <Textarea
            label='Battle Logs'
            id='battleLogs'
            name='battleLogs'
            value={battleLogs}
            onChange={(e) => setBattleLogs(e.target.value)}
            placeholder='Paste your battle logs here...'
            rows={10}
            required
          />
          <Textarea
            label='Pet Usage Summary'
            id='petUsage'
            name='petUsage'
            value={petUsage}
            onChange={(e) => setPetUsage(e.target.value)}
            placeholder='Paste your pet usage data here...'
            rows={5}
            required
          />
        </Form>
      </div>
      {parseBattleLog.length && parsePetUsage.length ? (
        <AnalyzeToolDetails
          playerName={playerName}
          parsedBattleLogs={parsedBattleLogs}
          parsedPetUsage={parsedPetUsage}
        />
      ) : null}
    </>
  );
};
