import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children,
  onClick,
  title
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-200 text-gray-800',
    destructive: 'bg-red-100 text-red-800'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  if (onClick) {
    return (
      <button className={classes} onClick={onClick} title={title}>
        {children}
      </button>
    );
  }
  
  return (
    <span className={classes} title={title}>
      {children}
    </span>
  );
}; 