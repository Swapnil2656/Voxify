import React from 'react';

const TextArea = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  label = '',
  error = '',
  id,
  name,
  required = false,
  rows = 4,
  maxLength,
  showCount = false,
  ...props
}) => {
  const baseClasses = `
    w-full px-4 py-3 bg-white dark:bg-neutral-800 
    border border-neutral-300 dark:border-neutral-600 rounded-lg 
    shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 
    focus:border-primary-500 transition-all duration-200
    ${disabled ? 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900' : ''}
    ${error ? 'border-error focus:ring-error focus:border-error' : ''}
    ${className}
  `;

  const characterCount = value?.length || 0;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={baseClasses}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        {...props}
      />
      
      {(error || (showCount && maxLength)) && (
        <div className="mt-1 flex justify-between">
          {error && <p className="text-sm text-error">{error}</p>}
          {showCount && maxLength && (
            <p className={`text-xs ${characterCount > maxLength * 0.9 ? 'text-warning' : 'text-neutral-500 dark:text-neutral-400'}`}>
              {characterCount}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TextArea;
