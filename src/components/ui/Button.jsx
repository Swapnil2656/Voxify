import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  accent: 'bg-accent-500 hover:bg-accent-600 text-white',
  success: 'bg-success hover:bg-success/90 text-white',
  danger: 'bg-error hover:bg-error/90 text-white',
  warning: 'bg-warning hover:bg-warning/90 text-white',
  info: 'bg-info hover:bg-info/90 text-white',
  outline: 'bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
  ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200',
  link: 'bg-transparent underline text-primary-500 hover:text-primary-600 p-0',
};

const sizes = {
  xs: 'py-1 px-2 text-xs',
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-2.5 px-5 text-lg',
  xl: 'py-3 px-6 text-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  fullWidth = false,
  animate = true,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const buttonContent = (
    <>
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </>
  );

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return animate ? (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {buttonContent}
    </motion.button>
  ) : (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
