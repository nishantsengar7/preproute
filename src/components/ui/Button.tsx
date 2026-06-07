import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import Loader from './Loader';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-transparent active:scale-[0.98]',
    outline: 'bg-transparent border border-neutral-300 hover:bg-neutral-55 hover:border-neutral-400 text-neutral-700 active:scale-[0.98]',
    danger: 'bg-red-600 hover:bg-red-75 text-white border border-transparent shadow-sm hover:shadow active:scale-[0.98]',
    ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader size="sm" variant={variant === 'primary' || variant === 'danger' ? 'white' : 'primary'} />}
      {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
