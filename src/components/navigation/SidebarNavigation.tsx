'use client';

import { useState, useEffect } from 'react';
import { DesktopSidebarNavigation } from './DesktopSidebarNavigation';
import { MobileSidebarNavigation } from './MobileSidebarNavigation';

export function SidebarNavigation({ className }: { className?: string }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return <MobileSidebarNavigation />;
  }

  return <DesktopSidebarNavigation className={className} />;
}
