import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'neutral';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const variantClasses = {
    primary: 'border-indigo-600/20 border-t-indigo-600',
    white: 'border-white/20 border-t-white',
    neutral: 'border-neutral-250 border-t-neutral-600',
  };

  return (
    <div
      role="status"
      aria-label="loading"
      className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
