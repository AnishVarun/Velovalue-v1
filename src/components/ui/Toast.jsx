import React, { useEffect, useState } from 'react';
import { cn } from '../../utils';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast component for displaying notifications
 */
const Toast = ({
  id,
  title,
  description,
  type = 'default',
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  // Toast icon based on type
  const ToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  // Toast background color based on type
  const toastStyles = {
    default: 'bg-white',
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={cn(
        'fixed right-4 max-w-sm rounded-lg border p-4 shadow-md transition-all duration-300 ease-in-out',
        toastStyles[type],
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      )}
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-start">
        {ToastIcon() && (
          <div className="flex-shrink-0 mr-3">
            <ToastIcon />
          </div>
        )}
        <div className="flex-1">
          {title && <h4 className="text-sm font-medium">{title}</h4>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * ToastContainer component for managing multiple toasts
 */
export const ToastContainer = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onDismiss={dismissToast}
          style={{ top: `${index * 4}rem` }}
        />
      ))}
    </div>
  );
};

export default Toast;
