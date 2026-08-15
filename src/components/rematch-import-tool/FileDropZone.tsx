'use client';

import { useRef, useState } from 'react';
import { FileDropZoneProps } from '@/types/rematch-import.types';
import { Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';

export function FileDropZone({ onFiles, disabled = false }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  function openFilePicker() {
    if (disabled) {
      return;
    }

    inputRef.current?.click();
  }

  return (
    <>
      <button
        type='button'
        disabled={disabled}
        onClick={openFilePicker}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();

          if (event.currentTarget.contains(event.relatedTarget as Node)) {
            return;
          }

          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();

          setIsDragging(false);

          if (event.dataTransfer.files.length) {
            onFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 shadow-md normal-case w-full',
          isDragging
            ? 'border-humanoid bg-background/80'
            : 'border-light-grey hover:border-blue-grey bg-background',
        )}
      >
        <Paragraph className='text-lg font-medium text-foreground/80 mb-2.5'>
          {disabled ? 'Reading…' : 'Drop your saved variables here'}
        </Paragraph>

        <Paragraph className='mx-auto mt-2.5 text-sm leading-relaxed text-foreground/80'>
          {
            'Rematch.lua gives you the teams. To get the teams with their battle scripts, upload tdBattlePetScript.lua as well — both files together or one at a time.'
          }
        </Paragraph>

        <Paragraph className='mt-4 mx-auto mt-2.5 text-sm leading-relaxed text-humanoid'>
          {
            'Folder where to find the files : World of Warcraft / _retail_ / WTF / Account / <ACCOUNT> / SavedVariables /'
          }
        </Paragraph>
      </button>

      <input
        ref={inputRef}
        type='file'
        accept='.lua,text/plain'
        multiple
        className='hidden'
        onChange={(event) => {
          if (event.target.files?.length) {
            onFiles(event.target.files);
          }
          event.target.value = '';
        }}
      />
    </>
  );
}
