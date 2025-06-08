// ===================================================================
// COMPONENTE ALERT MODAL - ELARIA RPG
// ===================================================================

import React, { useEffect } from 'react';
import { XCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export interface AlertModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  autoClose?: boolean;
  duration?: number;
}

export default function AlertModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  actionButton,
  autoClose = false,
  duration = 5000
}: AlertModalProps) {

  // Auto-close functionality
  useEffect(() => {
    if (isOpen && autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-blue-500" />;
    }
  };

  const getHeaderStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  const getActionButtonStyles = () => {
    if (!actionButton) return '';
    
    const variant = actionButton.variant || 'primary';
    
    switch (type) {
      case 'success':
        return variant === 'primary' 
          ? 'bg-green-600 hover:bg-green-700 text-white'
          : 'bg-green-100 hover:bg-green-200 text-green-800';
      case 'error':
        return variant === 'primary' 
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-red-100 hover:bg-red-200 text-red-800';
      case 'warning':
        return variant === 'primary' 
          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
          : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 'info':
        return variant === 'primary' 
          ? 'bg-blue-600 hover:bg-blue-700 text-white'
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
          
          {/* Header with icon */}
          <div className={`px-6 py-4 border-b ${getHeaderStyles()}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-4 flex-1">
                <h3 className={`text-lg font-bold ${getTitleColor()}`}>
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Fechar
            </button>
            
            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getActionButtonStyles()}`}
              >
                {actionButton.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 