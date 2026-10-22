import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps): React.ReactElement {
  return (
    <div
      onClick={onClick}
      className={`rounded-card border border-border-subtle dark:border-border-dark bg-surface dark:bg-surface-dark p-6 shadow-card ${
        onClick ? 'cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-card-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
