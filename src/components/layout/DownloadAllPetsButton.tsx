'use client';

import { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';
import { downloadPetsFromDB } from '@/actions/supabase/pets-schema/downloadPetsFromDB';
import * as XLSX from 'xlsx';
import { toastError } from '@/utils/toast';

export function DownloadAllPetsButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await downloadPetsFromDB();

      if (error) return toastError(error);

      const sheetData = data?.map((pet) => ({
        ID: pet.id,
        Name: pet.name,
        Type: pet.type,
        Expansion: pet.expansion,
        Tradable: pet.is_tradable ? 'yes' : 'no',
        Capturable: pet.is_capturable ? 'yes' : 'no',
        Vanity: pet.is_vanity ? 'yes' : 'no',
        Horde_Only: pet.is_horde ? 'yes' : 'no',
        Alliance_Only: pet.is_alliance ? 'yes' : 'no',
        Ability_1: pet.ability_1,
        Ability_2: pet.ability_2,
        Ability_3: pet.ability_3,
        Ability_4: pet.ability_4,
        Ability_5: pet.ability_5,
        Ability_6: pet.ability_6,
        Base_Health: pet.base_health,
        Base_Power: pet.base_power,
        Base_Speed: pet.base_speed,
        Breeds: pet.breeds?.join(', '),
        Source: pet.source,
        Description: pet.description,
        Icon_Url: pet.icon?.secure_url,
        Image_Url: pet.image?.secure_url,
      }));

      const orderedPets = sheetData?.sort((a, b) => a.ID - b.ID) || [];
      const worksheet = XLSX.utils.json_to_sheet(orderedPets);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'All Pets');
      XLSX.writeFile(workbook, 'all-wow-pets.xlsx');
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
      <span>{isLoading ? 'Downloading...' : 'All Pets'}</span>
    </Button>
  );
}
