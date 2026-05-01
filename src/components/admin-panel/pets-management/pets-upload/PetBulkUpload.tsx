'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaFileUpload, FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { createPetsInBulk } from '@/actions/supabase/pets-schema/pets/createPet';
import { ExcelPetRow, UpdateMode } from '@/types/supabase.types';
import { toastError, toastSuccess } from '@/utils/toast';
import { Button, Heading, Paragraph } from '@/components/ui';

// Helper function to convert to plain object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPlainObject(obj: any): ExcelPetRow {
  return {
    'Pet ID': String(obj['Pet ID'] || ''),
    Name: String(obj.Name || ''),
    Type: String(obj.Type || ''),
    Tradable: String(obj.Tradable || ''),
    'Ability 1': String(obj['Ability 1'] || ''),
    'Ability 2': String(obj['Ability 2'] || ''),
    'Ability 3': String(obj['Ability 3'] || ''),
    'Ability 4': String(obj['Ability 4'] || ''),
    'Ability 5': String(obj['Ability 5'] || ''),
    'Ability 6': String(obj['Ability 6'] || ''),
    'Base Health': String(obj['Base Health'] || ''),
    'Base Power': String(obj['Base Power'] || ''),
    'Base Speed': String(obj['Base Speed'] || ''),
    'Available Breeds': String(obj['Available Breeds'] || ''),
    Source: String(obj.Source || ''),
    Capturable: String(obj.Capturable || ''),
    Expansion: String(obj.Expansion || ''),
    'Horde Only': String(obj['Horde Only'] || ''),
    'Alliance Only': String(obj['Alliance Only'] || ''),
    Vanity: String(obj.Vanity || ''),
    Description: String(obj.Description || ''),
    Icon: String(obj.Icon || ''),
    Image: String(obj.Image || ''),
  };
}

export function PetBulkUpload() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updateMode, setUpdateMode] = useState<UpdateMode>('update');
  const [previewData, setPreviewData] = useState<ExcelPetRow[]>([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Convert to plain objects
      const plainData = json.map(toPlainObject);
      setPreviewData(plainData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (previewData.length === 0) {
      toastError('Please upload a file first');
      return;
    }

    setLoading(true);

    try {
      const result = await createPetsInBulk(
        previewData,
        updateMode,
        '/admin-panel/pets',
      );

      if (result?.success && result.results) {
        const { created, updated, skipped, errors } = result.results;
        let message = `Upload complete!\n`;
        message += `Created: ${created}\n`;
        message += `Updated: ${updated}\n`;
        message += `Skipped: ${skipped}\n`;

        if (errors.length > 0) {
          message += `\nErrors (${errors.length}):\n${errors.slice(0, 5).join('\n')}`;
          if (errors.length > 5) {
            message += `\n... and ${errors.length - 5} more`;
          }
        }

        toastSuccess(message);
        router.push('/admin-panel/pets');
      } else {
        toastError(`Error: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      toastError(`Upload failed: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateMode(e.target.value as UpdateMode);
  };

  const downloadTemplate = () => {
    const template: ExcelPetRow[] = [
      {
        'Pet ID': '1',
        Name: 'Example Pet',
        Type: 'Beast',
        Tradable: 'Yes',
        'Ability 1': 'Claw',
        'Ability 2': 'Bite',
        'Ability 3': 'Claw',
        'Ability 4': 'Bite',
        'Ability 5': 'Claw',
        'Ability 6': 'Bite',
        'Base Health': '7.5',
        'Base Power': '8',
        'Base Speed': '8.5',
        'Available Breeds': 'P/P,S/S',
        Source: 'Vendor',
        Capturable: 'Yes',
        Expansion: 'Classic',
        'Horde Only': '',
        'Alliance Only': '',
        Vanity: 'No',
        Description: 'An example pet',
        Icon: '',
        Image: '',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pets');
    XLSX.writeFile(workbook, 'pet-upload-template.xlsx');
  };

  return (
    <div className='bg-background rounded-lg flex flex-col w-full p-2.5 lg:p-5'>
      {/* Download Template */}
      <div className='space-y-2.5 lg:space-y-5'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid'>
          {'Step 1: Download Template'}
        </Heading>
        <Button
          onClick={downloadTemplate}
          variant='inverted'
          className='flex items-center gap-2.5'
        >
          <FaDownload />
          {'Download Excel Template'}
        </Button>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Update Mode */}
      <div className='space-y-2.5 lg:space-y-5'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid'>
          {'Step 2: Choose Update Mode'}
        </Heading>

        {/* <div className='space-y-2'> */}
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='radio'
            name='updateMode'
            value='skip'
            checked={updateMode === 'skip'}
            onChange={handleUpdateModeChange}
            className='block border rounded-lg bg-foreground cursor-pointer ring-humanoid  accent-humanoid'
          />
          <div>
            <strong>{'Skip existing'}</strong>
            <Paragraph className='text-sm text-foreground/70'>
              {"Don't update any existing pets, only add new ones"}
            </Paragraph>
          </div>
        </label>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='radio'
            name='updateMode'
            value='update'
            checked={updateMode === 'update'}
            onChange={handleUpdateModeChange}
            className='block border rounded-lg bg-foreground cursor-pointer ring-humanoid  accent-humanoid'
          />
          <div>
            <strong>{'Update incomplete'}</strong>
            <Paragraph className='text-sm text-foreground/70'>
              {'Only update pets that have missing data'}
            </Paragraph>
          </div>
        </label>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='radio'
            name='updateMode'
            value='overwrite'
            checked={updateMode === 'overwrite'}
            onChange={handleUpdateModeChange}
            className='block border rounded-lg bg-foreground cursor-pointer ring-humanoid  accent-humanoid'
          />
          <div>
            <strong>{'Overwrite all'}</strong>
            <Paragraph className='text-sm text-foreground/70'>
              {'Replace all existing pet data with new data'}
            </Paragraph>
          </div>
        </label>
        {/* </div> */}
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* File Upload */}
      <div className='space-y-2.5 lg:space-y-5'>
        <Heading as='h3' className='text-lg font-semibold text-humanoid'>
          {'Step 3: Upload Excel File'}
        </Heading>

        <div className='flex flex-col lg:flex-row items-start lg:items-center gap-2.5 lg:gap-5'>
          <label className='cursor-pointer'>
            <input
              type='file'
              accept='.xlsx,.xls'
              onChange={handleFileUpload}
              className='hidden'
            />
            <div className='btn-inverted flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:border-foreground transition-colors'>
              <FaFileUpload />
              <span>{'Choose Excel File'}</span>
            </div>
          </label>

          {fileName && (
            <Paragraph className='text-sm text-foreground/80'>
              {`Selected: ${fileName}`}
            </Paragraph>
          )}
        </div>
      </div>

      <div className='rounded-full w-full h-[1px] my-5 mx-auto bg-blue-grey' />

      {/* Preview */}
      {previewData.length > 0 && (
        <div className='space-y-2.5 lg:space-y-5 pb-2.5 lg:pb-5'>
          <Heading as='h3' className='text-lg font-semibold text-humanoid'>
            {`Preview ${previewData.length} pet(s)`}
          </Heading>

          <div className='max-h-64 overflow-auto rounded-lg p-2.5 lg:p-5 bg-light-grey'>
            <ul className='space-y-1 text-sm'>
              {previewData.slice(0, 10).map((pet, index) => (
                <li key={index}>
                  {`#${pet['Pet ID']} - ${pet.Name} (${pet.Type})`}
                </li>
              ))}
              {previewData.length > 10 && (
                <li className='text-foreground/50'>
                  {`... and ${previewData.length - 10} more`}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className='flex items-center justify-center lg:justify-end gap-2.5 w-full'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => router.push('/admin-panel/pets')}
        >
          {'Cancel'}
        </Button>
        <Button
          onClick={handleUpload}
          disabled={loading || previewData.length === 0}
        >
          {loading ? 'Uploading...' : `Upload ${previewData.length} Pet(s)`}
        </Button>
      </div>
    </div>
  );
}
