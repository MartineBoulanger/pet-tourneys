'use client';

import { useState, useEffect, useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { Button, Heading, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';

export interface NavigationItem {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

interface DesktopSidebarNavigationProps {
  headingSelector?: string;
  containerSelector?: string;
  className?: string;
  scrollOffset?: number;
}

export const DesktopSidebarNavigation = ({
  headingSelector = 'h1, h2, h3, h4, h5, h6',
  containerSelector,
  className = '',
  scrollOffset = 80,
}: DesktopSidebarNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : document;

    if (!container) return;

    const headings = container.querySelectorAll(
      headingSelector
    ) as NodeListOf<HTMLElement>;
    const items: NavigationItem[] = [];

    headings.forEach((heading, index) => {
      if (!heading.id) {
        const id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `heading-${index}`;
        heading.id = id;
      }

      const level = parseInt(heading.tagName.charAt(1)) || 1;

      items.push({
        id: heading.id,
        text: heading.textContent || '',
        level,
        element: heading,
      });
    });

    setNavigationItems(items);
  }, [headingSelector, containerSelector]);

  useEffect(() => {
    if (navigationItems.length === 0) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          })[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: `-${scrollOffset}px 0px -80% 0px`,
        threshold: 0,
      }
    );

    navigationItems.forEach((item) => {
      observer.observe(item.element);
    });

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [navigationItems, scrollOffset]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - scrollOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out',
        isOpen ? 'w-12' : 'w-80',
        className
      )}
    >
      {/* Sidebar */}
      <div
        className={cn(
          'h-fit sticky top-[11%] bg-background rounded-lg shadow-md',
          'transition-all duration-300 ease-in-out overflow-hidden',
          'min-h-[calc(100vh-2rem)]'
        )}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-2.5 border-b border-light-grey bg-background'>
          {!isOpen && (
            <div className='flex-1 p-2.5'>
              <Heading as='h3' className='font-bold'>
                {'Page Navigation'}
              </Heading>
              <Paragraph className='text-sm text-foreground/30'>
                {navigationItems.length}
                {' rules available'}
              </Paragraph>
            </div>
          )}

          <Button
            variant='link'
            onClick={toggleSidebar}
            className={cn(
              'rounded-md hover:bg-blue-grey transition-colors',
              'text-foreground',
              isOpen ? 'mx-auto p-1' : 'p-2'
            )}
            aria-label={isOpen ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isOpen ? (
              <AiOutlineMenuUnfold className='w-5 h-5' />
            ) : (
              <AiOutlineMenuFold className='w-5 h-5' />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className='overflow-y-auto'>
          <div className='p-2.5 space-y-1'>
            {navigationItems.map((rule, index) => (
              <Button
                variant='link'
                key={rule.id}
                onClick={() => scrollToSection(rule.id)}
                className={cn(
                  'w-full flex items-center p-2.5 rounded-md transition-all duration-200',
                  'text-left hover:bg-blue-grey group',
                  activeId === rule.id
                    ? 'bg-blue-grey text-foreground'
                    : 'text-foreground',
                  isOpen && 'justify-center'
                )}
                title={isOpen ? rule.text : undefined}
              >
                <div
                  className={cn(
                    'text-sm flex items-center justify-center',
                    activeId === rule.id
                      ? 'text-foreground'
                      : 'text-foreground/50',
                    !isOpen && 'mr-2.5'
                  )}
                >
                  {'#'}
                  {index + 1}
                </div>

                {!isOpen && (
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between'>
                      <div
                        className={cn(
                          'text-sm',
                          activeId === rule.id
                            ? 'text-foreground'
                            : 'text-foreground/50'
                        )}
                      >
                        {rule.text}
                      </div>

                      <div
                        className={cn(
                          'ml-2.5 flex-shrink-0',
                          activeId === rule.id
                            ? 'text-foreground'
                            : 'text-foreground/50'
                        )}
                      >
                        <FaChevronRight className='w-4 h-4 flex-shrink-0' />
                      </div>
                    </div>
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
