'use client';

import { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import { downloadRulesPDF } from '../../actions/rules';

export function DownloadRulesButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const result = await downloadRulesPDF();

      if (!result.success) {
        throw new Error(result.error);
      }

      // Add type guard to ensure data exists
      if (!result.data) {
        throw new Error('No PDF data received');
      }

      // Convert base64 back to blob
      const binaryString = atob(result.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'PvPPetBattleTournamentRules.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading rules:', error);
      alert('Failed to download rules. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <FaFileDownload className={`w-4 h-4 flex-shrink-0`} />
      <span>{isLoading ? 'Downloading...' : 'Download Rules'}</span>
    </Button>
  );
}
