import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  animate = false,
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-neutral-800 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700 overflow-hidden';
  
  const cardClasses = `${baseClasses} ${className}`;
  
  if (animate) {
    return (
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  if (hover) {
    return (
      <motion.div
        className={cardClasses}
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  const classes = `px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  const classes = `text-xl font-semibold text-neutral-900 dark:text-neutral-100 ${className}`;
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  const classes = `p-6 ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  const classes = `px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
