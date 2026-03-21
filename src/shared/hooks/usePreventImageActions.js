import { useEffect } from 'react';

export default function usePreventImageActions() {
  useEffect(() => {
    const blockImageMenu = (event) => {
      if (event.target instanceof Element && event.target.closest('img')) {
        event.preventDefault();
      }
    };

    const blockImageDrag = (event) => {
      if (event.target instanceof Element && event.target.closest('img')) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', blockImageMenu);
    document.addEventListener('dragstart', blockImageDrag);

    return () => {
      document.removeEventListener('contextmenu', blockImageMenu);
      document.removeEventListener('dragstart', blockImageDrag);
    };
  }, []);
}
