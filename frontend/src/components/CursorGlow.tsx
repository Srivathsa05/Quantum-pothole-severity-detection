import { useEffect } from 'react';

export const CursorGlow = () => {
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', updateCursor);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  return null;
};
