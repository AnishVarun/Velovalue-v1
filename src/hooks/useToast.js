import { useState, useCallback } from 'react';
import { generateId } from '../utils';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast management functions and state
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const toast = useCallback(
    ({ title, description, type = 'default', duration = 5000 }) => {
      const id = generateId();
      const newToast = {
        id,
        title,
        description,
        type,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  // Dismiss a toast by ID
  const dismissToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toast,
    dismissToast,
    clearToasts,
    toasts,
  };
}

export default useToast;
