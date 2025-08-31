'use client';

import { useState, useEffect, useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from 'react-icons/ai';
import { Button, Heading, Paragraph } from '@/components/ui';
import { cn } from '@/utils/cn';
import { NavigationItem } from './DesktopSidebarNavigation';

interface MobileSidebarNavigationProps {
  headingSelector?: string;
  containerSelector?: string;
  scrollOffset?: number;
}

export function MobileSidebarNavigation({
  headingSelector = 'h1, h2, h3, h4, h5, h6',
  containerSelector,
  scrollOffset = 80,
}: MobileSidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

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

    setIsOpen(false);
  };

  if (navigationItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Fixed Mobile Navigation Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn('fixed top-[18%] right-0 z-30 p-2 rounded-r-none')}
        aria-label='Open rules navigation'
      >
        <AiOutlineMenuFold className='w-6 h-6' />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed w-full h-full inset-0 flex items-center justify-center'
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div
            className={cn(
              'fixed right-0 top-[10%] h-full w-full bg-background z-50',
              'animate-slide-in-right',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className='flex items-center justify-between p-5 bg-dark-grey'>
              <div>
                <Heading as='h3' className='font-bold'>
                  {'Page Navigation'}
                </Heading>
                <Paragraph className='text-sm text-foreground/50'>
                  {navigationItems.length}
                  {' rules available'}
                </Paragraph>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                aria-label='Close navigation'
              >
                <AiOutlineMenuUnfold className='w-6 h-6' />
              </Button>
            </div>

            {/* Navigation List */}
            <div className='flex-1 overflow-y-auto'>
              <div className='p-2.5 space-y-1'>
                {navigationItems.map((rule, index) => (
                  <Button
                    variant='link'
                    key={rule.id}
                    onClick={() => scrollToSection(rule.id)}
                    className={cn(
                      'w-full flex items-center p-2.5 rounded-lg transition-all duration-200',
                      'text-left hover:bg-blue-grey active:bg-blue-grey',
                      activeId === rule.id ? 'bg-blue-grey' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'mr-2.5 flex items-center justify-center p-1.5 rounded-lg',
                        activeId === rule.id ? '' : 'text-foreground/50'
                      )}
                    >
                      {'#'}
                      {index + 1}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <div
                          className={cn(
                            'pr-2.5',
                            activeId === rule.id
                              ? 'text-foreground'
                              : 'text-foreground/50'
                          )}
                        >
                          {rule.text}
                        </div>

                        <div
                          className={cn(
                            'flex-shrink-0',
                            activeId === rule.id
                              ? 'text-foreground'
                              : 'text-foreground/50'
                          )}
                        >
                          <FaChevronRight className='w-4 h-4 flex-shrink-0' />
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
