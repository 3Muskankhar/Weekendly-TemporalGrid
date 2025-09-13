'use client';

import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-2xl border transition-all duration-200';
  
  const variants = {
    default: 'bg-white border-gray-200 shadow-sm',
    elevated: 'bg-white border-gray-200 shadow-lg',
    outlined: 'bg-transparent border-2 border-gray-300',
    filled: 'bg-gray-50 border-gray-200',
    gradient: 'bg-gradient-to-br from-coral-50 to-teal-50 border-coral-200'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;
  
  const MotionCard = motion.div;
  
  return (
    <MotionCard
      className={classes}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </MotionCard>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`p-6 pt-4 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
