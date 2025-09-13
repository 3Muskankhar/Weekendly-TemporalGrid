'use client';

import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-coral-500 hover:bg-coral-600 text-white focus:ring-coral-500 shadow-sm hover:shadow-md',
    secondary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-coral-500 text-coral-500 hover:bg-coral-50 focus:ring-coral-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
