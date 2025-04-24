import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  label = '',
  error = '',
  id,
  name,
  required = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null
  );
  const selectRef = useRef(null);

  useEffect(() => {
    const option = options.find(option => option.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const baseClasses = 'relative w-full';
  const selectClasses = `
    w-full px-4 py-2.5 text-left bg-white dark:bg-neutral-800 
    border border-neutral-300 dark:border-neutral-600 rounded-lg 
    shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 
    focus:border-primary-500 transition-all duration-200
    ${disabled ? 'opacity-60 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900' : 'cursor-pointer'}
    ${error ? 'border-error focus:ring-error focus:border-error' : ''}
    ${className}
  `;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: { opacity: 1, y: 0, height: 'auto' }
  };

  return (
    <div className={baseClasses} ref={selectRef}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
        >
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <button
        type="button"
        id={id}
        name={name}
        className={selectClasses}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
      >
        <div className="flex items-center justify-between">
          <span className={`block truncate ${!selectedOption ? 'text-neutral-500 dark:text-neutral-400' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none">
            <svg 
              className={`h-5 w-5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-neutral-200 dark:border-neutral-700 py-1 max-h-60 overflow-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.15 }}
          >
            <ul className="py-1" role="listbox">
              {options.map((option) => (
                <motion.li
                  key={option.value}
                  className={`
                    px-4 py-2 cursor-pointer text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700
                    ${selectedOption?.value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300'}
                  `}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selectedOption?.value === option.value}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                >
                  {option.label}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Select;
