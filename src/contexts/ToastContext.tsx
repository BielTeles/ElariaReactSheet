// ===================================================================
// CONTEXTO DE TOAST - ELARIA RPG
// ===================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastProps } from '../components/Toast';

interface ToastItem extends ToastProps {
  id: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'onClose'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastProps, 'onClose'>) => {
    const id = generateId();
    const newToast: ToastItem = {
      ...toast,
      id,
      onClose: () => removeToast(id)
    };

    setToasts(prev => [...prev, newToast]);
  }, [generateId, removeToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: 6000 // Erros ficam mais tempo
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  }, [showToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Container dos Toasts */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                type={toast.type}
                title={toast.title}
                message={toast.message}
                duration={toast.duration}
                onClose={toast.onClose}
                autoClose={toast.autoClose}
              />
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}; 