import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => {
  const classes = `rounded-lg border border-gray-200 bg-white shadow-sm ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children }) => {
  const classes = `text-lg font-semibold leading-none tracking-tight ${className}`;
  
  return (
    <h3 className={classes}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
  const classes = `p-6 pt-0 ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}; 