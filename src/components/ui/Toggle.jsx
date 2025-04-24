import React from 'react';
import { motion } from 'framer-motion';

const Toggle = ({
  isOn,
  onToggle,
  label = '',
  disabled = false,
  className = '',
  id,
  ...props
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${className}`}>
      <label 
        htmlFor={toggleId}
        className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only"
          checked={isOn}
          onChange={onToggle}
          disabled={disabled}
          {...props}
        />
        <div 
          className={`
            w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
            ${isOn ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600'}
            ${disabled ? 'opacity-60' : ''}
          `}
        >
          <motion.div 
            className={`
              absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md
              transform transition-transform duration-200 ease-in-out
            `}
            animate={{ x: isOn ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
        {label && (
          <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Toggle;
