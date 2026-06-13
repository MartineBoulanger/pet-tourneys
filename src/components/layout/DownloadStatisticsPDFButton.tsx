'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { FaFileDownload } from 'react-icons/fa';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { DownloadStatisticsPDFButtonProps } from '@/types/supabase.types';
import { StatisticsPDF } from '@/components/leagues/statistics/StatisticsPDF';

export function DownloadStatisticsPDFButton({
  leagueName,
  petStats,
  battleStats,
  isMatchView,
  className,
  chartData,
  matchRegion = '',
  matchOwner = '',
}: DownloadStatisticsPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await pdf(
        <StatisticsPDF
          leagueName={leagueName}
          petStats={petStats}
          battleStats={battleStats}
          isMatchView={isMatchView}
          chartData={chartData}
          matchRegion={matchRegion}
          matchOwner={matchOwner}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${leagueName.replace(/\s+/g, '-')}-statistics.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <FaFileDownload className={`w-4 h-4 flex-shrink-0`} />
      <span>{loading ? 'Downloading...' : 'Statistics PDF'}</span>
    </Button>
  );
}
