'use client';

import { useEffect, useState, RefObject } from 'react';

export function useHasFocus<T extends HTMLElement = HTMLElement>(
  elRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleFocusIn = () => {
    setValue(true);
  };

  const handleFocusOut = () => {
    setValue(false);
  };

  useEffect(() => {
    elRef.current?.addEventListener('focusin', handleFocusIn);
    elRef.current?.addEventListener('focusout', handleFocusOut);
    return () => {
      elRef.current?.removeEventListener('focusin', handleFocusIn);
      elRef.current?.removeEventListener('focusout', handleFocusOut);
      handleFocusOut();
    };
  }, [elRef.current]);

  return value;
}
