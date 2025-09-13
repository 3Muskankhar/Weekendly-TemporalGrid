'use client';

import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-coral-100 text-coral-800',
    secondary: 'bg-teal-100 text-teal-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    mood: {
      happy: 'bg-yellow-100 text-yellow-800',
      relaxed: 'bg-green-100 text-green-800',
      energetic: 'bg-orange-100 text-orange-800',
      focused: 'bg-blue-100 text-blue-800',
      creative: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800'
    }
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  const variantClass = typeof variant === 'object' ? 
    Object.values(variant).join(' ') : 
    variants[variant];
  
  const classes = `${baseClasses} ${variantClass} ${sizes[size]} ${className}`;
  
  return (
    <motion.span
      className={classes}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
