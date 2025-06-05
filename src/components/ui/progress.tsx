import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  // Garantir que o valor está entre 0 e 100
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  // Determinar a cor baseada no valor
  const getColorClass = (val: number) => {
    if (val <= 25) return 'bg-red-500';
    if (val <= 50) return 'bg-yellow-500';
    if (val <= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${getColorClass(normalizedValue)}`}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  );
}; 