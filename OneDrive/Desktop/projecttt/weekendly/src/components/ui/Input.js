'use client';

import { motion } from 'framer-motion';

const Input = ({ 
  label,
  error,
  className = '',
  variant = 'default',
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  const variants = {
    default: 'border-gray-300 focus:border-coral-500 focus:ring-coral-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  };
  
  const variantClass = error ? variants.error : variants[variant];
  const classes = `${baseClasses} ${variantClass} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.input
        className={classes}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      />
      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
