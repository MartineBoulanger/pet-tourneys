'use client';

import { Button } from '@/components/ui';

type DownloadButtonProps = {
  content: string;
  filename: string;
};

export function DownloadLuaButton({ content, filename }: DownloadButtonProps) {
  function handleDownload() {
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <Button type='button' onClick={handleDownload} disabled={!content}>
      {'Download PetMatch.lua'}
    </Button>
  );
}
