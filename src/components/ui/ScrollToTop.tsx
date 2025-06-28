'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './Button';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className='fixed bottom-20 lg:bottom-45 right-5 z-30'>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className='rounded-full p-5 shadow-lg transition-all duration-300 ease-in-out'
          title='Scroll to top'
          aria-label='Scroll to top'
        >
          <FaArrowUp className='w-5 h-5' />
        </Button>
      )}
    </div>
  );
};
