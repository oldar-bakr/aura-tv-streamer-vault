
import { useEffect, useCallback } from 'react';

export function useTVNavigation() {
  useEffect(() => {
    // Handle remote control key events
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          e.preventDefault();
          // Let the browser handle focus navigation
          break;
        case 'Enter':
          // Handle selection
          e.preventDefault();
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement) {
            activeElement.click();
          }
          break;
        case 'Backspace':
        case 'Escape':
          // Handle back navigation
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const setFocus = useCallback((focusKey: string) => {
    const element = document.querySelector(`[data-focus-key="${focusKey}"]`) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  const addFocusable = useCallback((options: { focusKey: string; onEnterPress?: () => void }) => {
    return {
      'data-focus-key': options.focusKey,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && options.onEnterPress) {
          e.preventDefault();
          options.onEnterPress();
        }
      }
    };
  }, []);

  const removeFocusable = useCallback((focusKey: string) => {
    // Simple implementation - just remove data attribute if needed
    const element = document.querySelector(`[data-focus-key="${focusKey}"]`);
    if (element) {
      element.removeAttribute('data-focus-key');
    }
  }, []);

  return {
    setFocus,
    addFocusable,
    removeFocusable
  };
}
