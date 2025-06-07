// ===================================================================
// COMPONENTE BUTTON - DESIGN SYSTEM
// ===================================================================

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Variantes do botão
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive'
  | 'success';

/**
 * Tamanhos do botão
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props do componente Button
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
  /** Estado de loading */
  isLoading?: boolean;
  /** Ícone à esquerda do texto */
  leftIcon?: React.ReactNode;
  /** Ícone à direita do texto */
  rightIcon?: React.ReactNode;
  /** Ocupar toda a largura disponível */
  fullWidth?: boolean;
  /** Texto do loading */
  loadingText?: string;
}

/**
 * Estilos base do botão
 */
const baseStyles = `
  inline-flex items-center justify-center gap-2 
  font-medium rounded-lg transition-all duration-200 
  focus:outline-none focus:ring-2 focus:ring-offset-2 
  disabled:opacity-50 disabled:cursor-not-allowed
  active:scale-95
`;

/**
 * Estilos por variante
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-blue-600 to-blue-700 text-white 
    hover:from-blue-700 hover:to-blue-800 
    focus:ring-blue-500 
    shadow-lg hover:shadow-xl
  `,
  secondary: `
    bg-gradient-to-r from-gray-600 to-gray-700 text-white 
    hover:from-gray-700 hover:to-gray-800 
    focus:ring-gray-500 
    shadow-lg hover:shadow-xl
  `,
  outline: `
    border-2 border-blue-600 text-blue-600 bg-transparent 
    hover:bg-blue-600 hover:text-white 
    focus:ring-blue-500
  `,
  ghost: `
    text-gray-700 bg-transparent 
    hover:bg-gray-100 hover:text-gray-900 
    focus:ring-gray-500
  `,
  destructive: `
    bg-gradient-to-r from-red-600 to-red-700 text-white 
    hover:from-red-700 hover:to-red-800 
    focus:ring-red-500 
    shadow-lg hover:shadow-xl
  `,
  success: `
    bg-gradient-to-r from-green-600 to-green-700 text-white 
    hover:from-green-700 hover:to-green-800 
    focus:ring-green-500 
    shadow-lg hover:shadow-xl
  `,
};

/**
 * Estilos por tamanho
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

/**
 * Componente Button reutilizável
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    loadingText,
    className = '',
    disabled,
    ...props
  }, ref) => {
    
    const isDisabled = disabled || isLoading;
    
    const buttonClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? 'w-full' : '',
      className
    ].join(' ').trim();
  
  return (
      <button
        ref={ref}
        className={buttonClassName}
        disabled={isDisabled}
        {...props}
      >
        {/* Ícone de loading ou ícone esquerdo */}
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        
        {/* Texto do botão */}
        <span>
          {isLoading ? (loadingText || 'Carregando...') : children}
        </span>
        
        {/* Ícone direito (não mostra durante loading) */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
    </button>
  );
  }
);

Button.displayName = 'Button';

// Exportação padrão para compatibilidade
export default Button;