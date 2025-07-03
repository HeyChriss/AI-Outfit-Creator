import { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
}

interface UseScreenSizeReturn {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useScreenSize = (): UseScreenSizeReturn => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}; 