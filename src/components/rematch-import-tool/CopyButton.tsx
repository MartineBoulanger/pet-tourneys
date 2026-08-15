'use client';

import { useRef, useState } from 'react';

import { copyToClipboard } from '@/utils/rematch-import/clipboard';
import { Button } from '../ui';
import { CopyButtonProps } from '@/types/rematch-import.types';

export function CopyButton({ text, variant, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleCopy() {
    try {
      await copyToClipboard(text);

      setCopied(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1400);
    } catch (cause) {
      console.error('Unable to copy text:', cause);
    }
  }

  return (
    <Button type='button' variant={variant ?? 'primary'} onClick={handleCopy}>
      {copied ? 'Copied' : children}
    </Button>
  );
}
