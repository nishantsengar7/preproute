import React, { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      wrapperClassName = '',
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-neutral-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-neutral-450">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-neutral-400
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-neutral-300 hover:border-neutral-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-neutral-450">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium animate-fade-in">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-neutral-500 font-medium">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
