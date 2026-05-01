'use client';

import { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import { getUsedPetsPerLeagueForExport } from '@/actions/supabase/api-schema/statistics/getUsedPetsPerLeague';
import * as XLSX from 'xlsx';

export function DownloadLeagueUsedPets({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const data = await getUsedPetsPerLeagueForExport(id);

      if (!data) return;

      const sheetData = data?.map((pet) => ({
        ID: pet.id,
        Name: pet.name,
        Type: pet.type,
        Base_Health: pet.baseStats?.health,
        Base_Power: pet.baseStats?.power,
        Base_Speed: pet.baseStats?.speed,
        Breeds: pet.breeds.join(', '),
        Stats: pet.statsRaw.join(', '),
        Total_Played: pet.totalPlayed,
      }));

      const orderedPets = sheetData.sort(
        (a, b) => (b.Total_Played ?? 0) - (a.Total_Played ?? 0),
      );
      const safeName = name.replace(/[\\/:*?"<>|]/g, '');
      const filename = 'Used Pets - ' + safeName;

      const worksheet = XLSX.utils.json_to_sheet(orderedPets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Used Pets');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } catch (error) {
      console.error('Error downloading used pets:', error);
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
      <span>{isLoading ? 'Downloading...' : 'Used Pets'}</span>
    </Button>
  );
}
