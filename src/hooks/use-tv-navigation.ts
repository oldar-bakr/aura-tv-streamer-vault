import { useEffect } from 'react';
import { useSpatialNavigation } from 'react-spatial-navigation';

export function useTVNavigation() {
  const { init, setFocus, addFocusable, removeFocusable } = useSpatialNavigation();

  useEffect(() => {
    // Initialize spatial navigation
    init({
      debug: false,
      visualDebug: false
    });

    // Handle remote control key events
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          break;
        case 'Enter':
          // Handle selection
          e.preventDefault();
          break;
        case 'Backspace':
        case 'Back':
          // Handle back navigation
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [init]);

  return {
    setFocus,
    addFocusable,
    removeFocusable
  };
}