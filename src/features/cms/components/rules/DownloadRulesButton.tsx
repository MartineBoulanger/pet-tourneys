'use client';

import { FaFileDownload } from 'react-icons/fa';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

export function DownloadRulesButton({ className }: { className?: string }) {
  const handleDownload = () => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = '/PvP Pet Battle Tournament Rules.pdf';
    link.download = 'PvP Pet Battle Tournament Rules.pdf';
    link.target = '_blank'; // Open in new tab as fallback

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      onClick={handleDownload}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <FaFileDownload className={`w-4 h-4 flex-shrink-0`} />
      <span>{'Download Rules'}</span>
    </Button>
  );
}
