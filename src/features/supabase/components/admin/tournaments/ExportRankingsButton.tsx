'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FaFileDownload } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { getPlayerRecords } from '@/features/supabase/actions/players';

export function ExportRankingsButton({
  tournamentId,
  tournamentName,
}: {
  tournamentId: string;
  tournamentName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const { records, regions } = await getPlayerRecords(tournamentId);

      // Create enhanced records with both region and compositeId
      const enhancedRecords = records.map((player) => ({
        ...player,
        // Keep the original region field for display purposes
        region: player.region,
        // Add composite ID for unique identification
        compositeId: `${player.playerName}-${player.region}-${tournamentId}`,
        // Add finals flag
        isFinals: player.region.includes('Finals'),
      }));

      const exportData = {
        tournamentId,
        tournamentName,
        timestamp: new Date().toISOString(),
        records: enhancedRecords, // Now includes both region and compositeId
        regions,
        version: '1.4',
        dataModel: 'player-rankings-with-regions',
        note: 'Records include both region and compositeId for compatibility',
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `player-rankings-${tournamentId.slice(0, 5)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export successful!', {
        className: 'toast-success',
        description: 'Player rankings exported with regional data preserved',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed!', {
        className: 'toast-error',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className='btn-submit py-[7px] px-[11px] rounded-lg flex items-center gap-2.5'
      title='Export Rankings'
      aria-label='Export Rankings'
    >
      {isLoading ? (
        <>
          <FaFileDownload className='h-5 w-5' />{' '}
          <span>{'Downloading JSON...'}</span>
        </>
      ) : (
        <>
          <FaFileDownload className='h-5 w-5' />{' '}
          <span>{'Download Rankings'}</span>
        </>
      )}
    </Button>
  );
}
