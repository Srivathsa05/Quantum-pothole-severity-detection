import { useEffect } from 'react';

export const useCursorGlow = () => {
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      const beforeEl = document.body;
      if (beforeEl) {
        beforeEl.style.setProperty('--cursor-x', `${e.clientX}px`);
        beforeEl.style.setProperty('--cursor-y', `${e.clientY}px`);
        
        // Update pseudo-elements position via CSS custom properties
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    
    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);
};
