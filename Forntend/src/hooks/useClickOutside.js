import { useEffect } from 'react';

/**
 * A custom hook that triggers a callback when a click is detected outside of a referenced element.
 * @param {React.RefObject<HTMLElement>} ref - The ref of the element to monitor.
 * @param {() => void} handler - The function to call on an outside click.
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};