'use client';

import { useEffect, useState, RefObject } from 'react';

export function useHover<T extends HTMLElement = HTMLElement>(
  elRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setValue(true);
  };

  const handleMouseLeave = () => {
    setValue(false);
  };

  useEffect(() => {
    elRef.current?.addEventListener('focusin', handleMouseEnter);
    elRef.current?.addEventListener('focusout', handleMouseLeave);
    return () => {
      elRef.current?.removeEventListener('focusin', handleMouseEnter);
      elRef.current?.removeEventListener('focusout', handleMouseLeave);
      handleMouseLeave();
    };
  }, [elRef.current]);

  return value;
}
