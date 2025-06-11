'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Textarea, Button, Form } from '@/components/ui';

export function PetsDataConverter() {
  const router = useRouter();
  const [excelData, setExcelData] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  // Only one order of columns for the pet data, can always add columns -> but you have to add these in the excel sheet as well.
  const headers = [
    'petID',
    'name',
    'type',
    'isTradable',
    'ability1',
    'ability2',
    'ability3',
    'ability4',
    'ability5',
    'ability6',
    'baseHealth',
    'basePower',
    'baseSpeed',
    'availableBreeds',
    'source',
    'isCapturable',
    'expansion',
    'isHordeOnly',
    'isAllianceOnly',
    'icon',
    'image',
    'description',
  ];

  const convertToJson = () => {
    const rows = excelData.split('\n');
    const jsonData = rows.map((row) => {
      const columns = row.split('\t');
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = columns[index] || '';
      });
      return obj;
    });
    const jsonString = JSON.stringify(jsonData, null, 2);
    setJsonOutput(jsonString);
    return jsonString;
  };

  const downloadJsonFile = () => {
    const jsonString = convertToJson();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pets-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setExcelData('');
    setJsonOutput('');
  };

  return (
    <>
      <div className='bg-light-grey shadow-md rounded-lg p-2.5 sm:p-5'>
        <Form handleSubmit={convertToJson}>
          <Textarea
            label='Paste excel data here'
            id='pets-data'
            name='pets-data'
            value={excelData}
            onChange={(e) => setExcelData(e.target.value)}
            rows={10}
            required
          />
        </Form>
        <div className='flex items-center flex-wrap justify-end gap-2.5 sm:gap-5 mt-2.5 sm:mt-5'>
          <Button variant='secondary' onClick={() => router.back()}>
            {'Cancel'}
          </Button>
          <Button variant='secondary' onClick={handleClear}>
            {'Clear Form'}
          </Button>
          <Button onClick={convertToJson}>{'Convert to JSON'}</Button>
        </div>
      </div>
      {jsonOutput && (
        <>
          <div className='flex flex-row justify-between items-center mb-5 mt-5 sm:mt-10'>
            <Heading as='h2'>{'JSON Output'}</Heading>
            <Button onClick={downloadJsonFile}>{'Download JSON File'}</Button>
          </div>
          <div className='bg-light-grey shadow-md rounded-lg p-2.5 sm:p-5'>
            <pre className='p-2.5 sm:p-5 bg-background rounded-lg w-full overflow-auto max-h-[450px]'>
              {jsonOutput}
            </pre>
          </div>
        </>
      )}
    </>
  );
}
