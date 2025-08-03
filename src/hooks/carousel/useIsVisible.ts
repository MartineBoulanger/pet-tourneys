'use client';

import { useEffect, useState, RefObject } from 'react';

export function useIsVisible<T extends HTMLElement = HTMLElement>(
  elRef: RefObject<T>
): boolean {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );
    observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [elRef]);

  return isIntersecting;
}
