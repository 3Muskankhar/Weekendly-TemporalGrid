'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, PlayCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge, Button } from '@/components/ui';

const StatusIndicator = ({ 
  status, 
  onStatusChange, 
  size = 'md',
  showLabel = true,
  interactive = false,
  className = '' 
}) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-300',
      iconColor: 'text-gray-600'
    },
    inProgress: {
      label: 'In Progress',
      icon: PlayCircle,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
      iconColor: 'text-blue-600'
    },
    done: {
      label: 'Done',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      iconColor: 'text-green-600'
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      iconColor: 'text-red-600'
    }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;
  
  const handleClick = () => {
    if (interactive && onStatusChange) {
      const statuses = ['pending', 'inProgress', 'done', 'cancelled'];
      const currentIndex = statuses.indexOf(status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      onStatusChange(statuses[nextIndex]);
    }
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  if (interactive) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`inline-flex items-center space-x-2 rounded-full border-2 transition-all duration-200 cursor-pointer ${sizeClasses[size]} ${config.bgColor} ${config.borderColor} ${config.textColor} hover:shadow-md ${className}`}
      >
        <IconComponent size={iconSizes[size]} className={config.iconColor} />
        {showLabel && (
          <span className="font-medium">{config.label}</span>
        )}
      </motion.button>
    );
  }
  
  return (
    <Badge
      variant="default"
      size={size}
      className={`${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      <IconComponent size={iconSizes[size]} className={`${config.iconColor} mr-1`} />
      {showLabel && config.label}
    </Badge>
  );
};

export default StatusIndicator;
