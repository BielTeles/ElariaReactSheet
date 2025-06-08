// ===================================================================
// COMPONENTE TOAST - ELARIA RPG
// ===================================================================

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  autoClose?: boolean;
}

export default function Toast({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  autoClose = true 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Tempo da animação
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-yellow-400" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`
      max-w-sm w-full
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        rounded-lg border shadow-lg p-4
        ${getStyles()}
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">
              {title}
            </h3>
            {message && (
              <p className="mt-1 text-sm opacity-90">
                {message}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="h-5 w-5 opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 