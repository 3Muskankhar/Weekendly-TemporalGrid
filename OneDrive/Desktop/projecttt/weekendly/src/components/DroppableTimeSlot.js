// 'use client';

// import { useDroppable } from '@dnd-kit/core';
// import { motion } from 'framer-motion';
// import { Clock } from 'lucide-react';

// const DroppableTimeSlot = ({ 
//   time, 
//   day, 
//   isOver, 
//   hasActivity = false,
//   onDrop 
// }) => {
//   const { setNodeRef } = useDroppable({
//     id: `timeslot-${day}-${time}`,
//     data: {
//       type: 'timeslot',
//       day,
//       time,
//     },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`relative w-full h-20 border-b border-gray-100 transition-all duration-200 ${
//         isOver ? 'bg-coral-50 border-coral-200' : ''
//       } ${hasActivity ? 'bg-gray-50' : ''}`}
//     >
//       {/* Drop Indicator */}
//       {isOver && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="absolute inset-0 bg-coral-100 border-2 border-dashed border-coral-300 rounded-lg flex items-center justify-center"
//         >
//           <div className="flex items-center space-x-2 text-coral-600">
//             <Clock size={16} />
//             <span className="text-sm font-medium">{time}</span>
//           </div>
//         </motion.div>
//       )}
      
//       {/* Time Label */}
//       <div className="absolute -left-20 top-2 text-xs text-gray-500">
//         {time}
//       </div>
      
//       {/* Activity Area */}
//       <div className="h-full w-full p-2">
//         {/* This is where activities will be positioned */}
//       </div>
//     </div>
//   );
// };

// export default DroppableTimeSlot;
'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Clock, Plus, Lock } from 'lucide-react';
import { timeUtils } from '@/utils/scheduleUtils';

const DroppableTimeSlot = ({ 
  time, 
  day, 
  hasActivity = false,
  activities = [],
  height = 80,
  onAddActivity,
  weekendDates = null
}) => {
  // Check if this time slot is in the past
  const isPastTime = () => {
    if (!weekendDates) return false;
    
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    
    // Check if the day is today and time is in the past
    if (day === 'saturday' && timeUtils.isToday(weekendDates.start)) {
      return timeUtils.isTimeInPast(time, weekendDates.start);
    }
    if (day === 'sunday' && timeUtils.isToday(weekendDates.end)) {
      return timeUtils.isTimeInPast(time, weekendDates.end);
    }
    
    // Check if the day is in the past
    if (day === 'saturday' && timeUtils.isDateInPast(weekendDates.start)) {
      return true;
    }
    if (day === 'sunday' && timeUtils.isDateInPast(weekendDates.end)) {
      return true;
    }
    
    return false;
  };

  const isPast = isPastTime();

  const { setNodeRef, isOver } = useDroppable({
    id: `timeslot-${day}-${time}`,
    data: {
      type: 'timeslot',
      day,
      time,
      isPast
    },
    disabled: isPast // Disable dropping on past time slots
  });

  // Fixed time formatting
  const formatTime = (time) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const minute = minutes || '00';
    
    if (hour === 0) {
      return `12:${minute} AM`;
    } else if (hour < 12) {
      return `${hour}:${minute} AM`;
    } else if (hour === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour - 12}:${minute} PM`;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`relative pl-24 border-b border-gray-100 transition-all duration-200 ${
        isPast 
          ? 'bg-gray-100/50 opacity-60' 
          : isOver 
            ? 'bg-coral-50 border-coral-200 border-l-4 border-l-coral-400' 
            : hasActivity 
              ? 'bg-blue-50/30' 
              : 'hover:bg-gray-50/50'
      }`}
      style={{ height: `${height}px` }}
    >
      {/* Time Label (visible in gutter) */}
      <div className={`absolute left-2 top-2 text-xs font-semibold w-20 pointer-events-none z-10 text-right ${
        isPast ? 'text-gray-400' : 'text-gray-700'
      }`}>
        {formatTime(time)}
        {isPast && <Lock size={10} className="ml-1 inline" />}
      </div>
      
      {/* Drop Indicator */}
      {isOver && !isPast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-1 bg-coral-100 border-2 border-dashed border-coral-300 rounded-lg flex items-center justify-center z-10"
        >
          <div className="flex items-center space-x-2 text-coral-700">
            <Plus size={16} />
            <span className="text-sm font-medium">Drop here for {formatTime(time)}</span>
          </div>
        </motion.div>
      )}
      
      {/* Past Time Indicator */}
      {isPast && !hasActivity && (
        <div className="absolute inset-2 flex items-center justify-center">
          <div className="text-xs text-gray-400 flex items-center space-x-1">
            <Lock size={12} />
            <span>Past time</span>
          </div>
        </div>
      )}
      
      {/* Empty State for time slot */}
      {!hasActivity && !isOver && !isPast && (
        <div className="absolute inset-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 group">
          <button 
            className="text-xs text-gray-400 hover:text-coral-600 flex items-center space-x-1 bg-white/80 px-2 py-1 rounded-md shadow-sm border border-transparent hover:border-coral-200"
            onClick={() => onAddActivity && onAddActivity(time)}
          >
            <Plus size={12} />
            <span>Add</span>
          </button>
        </div>
      )}
      
      {/* Activities in this time slot */}
      <div className="h-full p-2 flex flex-col space-y-1">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`text-xs rounded p-1 shadow-sm border truncate ${
              isPast 
                ? 'bg-gray-200 border-gray-300 text-gray-500' 
                : 'bg-white border-gray-200'
            }`}
            title={activity.name}
          >
            <span className="font-medium">{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroppableTimeSlot;