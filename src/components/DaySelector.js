'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

const DaySelector = ({ 
  selectedDay, 
  onDayChange, 
  saturdayCount = 0, 
  sundayCount = 0,
  className = '' 
}) => {
  const days = [
    {
      id: 'saturday',
      label: 'Saturday',
      icon: Calendar,
      count: saturdayCount
    },
    {
      id: 'sunday',
      label: 'Sunday',
      icon: Clock,
      count: sundayCount
    }
  ];
  
  return (
    <div className={`flex space-x-2 ${className}`}>
      {days.map((day) => {
        const IconComponent = day.icon;
        const isSelected = selectedDay === day.id;
        
        return (
          <motion.div
            key={day.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={isSelected ? 'primary' : 'outline'}
              size="md"
              onClick={() => onDayChange(day.id)}
              className={`flex-1 flex items-center justify-center space-x-2 relative ${
                isSelected ? 'shadow-md' : ''
              }`}
            >
              <IconComponent size={16} />
              <span>{day.label}</span>
              {day.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-coral-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {day.count}
                </motion.span>
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DaySelector;
