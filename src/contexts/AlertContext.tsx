// ===================================================================
// CONTEXTO DE ALERT MODAL - ELARIA RPG
// ===================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AlertModal, { AlertModalProps } from '../components/AlertModal';

interface AlertItem extends Omit<AlertModalProps, 'isOpen' | 'onClose'> {
  id: string;
}

interface AlertContextType {
  showAlert: (alert: Omit<AlertModalProps, 'isOpen' | 'onClose'>) => void;
  showSuccess: (title: string, message: string, actionButton?: AlertModalProps['actionButton']) => void;
  showError: (title: string, message: string, actionButton?: AlertModalProps['actionButton']) => void;
  showWarning: (title: string, message: string, actionButton?: AlertModalProps['actionButton']) => void;
  showInfo: (title: string, message: string, actionButton?: AlertModalProps['actionButton']) => void;
  closeAlert: (id?: string) => void;
  closeAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  const closeAlert = useCallback((id?: string) => {
    if (id) {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } else {
      // Fecha o último alerta se não especificar ID
      setAlerts(prev => prev.slice(0, -1));
    }
  }, []);

  const showAlert = useCallback((alert: Omit<AlertModalProps, 'isOpen' | 'onClose'>) => {
    const id = generateId();
    const newAlert: AlertItem = {
      ...alert,
      id
    };

    // Substituir alert anterior se houver (só mostra um por vez)
    setAlerts([newAlert]);
  }, [generateId]);

  const showSuccess = useCallback((title: string, message: string, actionButton?: AlertModalProps['actionButton']) => {
    showAlert({
      type: 'success',
      title,
      message,
      actionButton
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, actionButton?: AlertModalProps['actionButton']) => {
    showAlert({
      type: 'error',
      title,
      message,
      actionButton
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, actionButton?: AlertModalProps['actionButton']) => {
    showAlert({
      type: 'warning',
      title,
      message,
      actionButton
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, actionButton?: AlertModalProps['actionButton']) => {
    showAlert({
      type: 'info',
      title,
      message,
      actionButton
    });
  }, [showAlert]);

  const closeAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const contextValue: AlertContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeAlert,
    closeAllAlerts
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      
      {/* Renderizar alerts */}
      {alerts.map((alert) => (
        <AlertModal
          key={alert.id}
          isOpen={true}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => closeAlert(alert.id)}
          actionButton={alert.actionButton}
          autoClose={alert.autoClose}
          duration={alert.duration}
        />
      ))}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert deve ser usado dentro de um AlertProvider');
  }
  return context;
}; 