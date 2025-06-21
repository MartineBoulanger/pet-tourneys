'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { FaFileDownload } from 'react-icons/fa';
import { getPlayerRecords } from '@/supabase/actions/players';

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

      const exportData = {
        tournamentId,
        tournamentName,
        timestamp: new Date().toISOString(),
        records,
        regions,
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
        description: 'Player rankings data is downloaded.',
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
      className='btn-link border py-3 px-4 rounded-lg border-blue-grey hover:bg-blue-grey hover:text-foreground'
    >
      {isLoading ? (
        '...'
      ) : (
        <>
          <FaFileDownload className='h-6 w-6' />
        </>
      )}
    </Button>
  );
}
