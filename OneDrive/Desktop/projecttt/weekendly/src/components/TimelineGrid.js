// 'use client';

// import { motion } from 'framer-motion';
// import { Clock } from 'lucide-react';

// const TimelineGrid = ({ 
//   showTimeSlots = true, 
//   startHour = 6, 
//   endHour = 23,
//   slotHeight = 80 
// }) => {
//   // Generate time slots
//   const timeSlots = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
//     const hour = i + startHour;
//     return {
//       time: `${hour.toString().padStart(2, '0')}:00`,
//       label: hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`,
//       isMajor: hour % 2 === 0 // Major slots every 2 hours
//     };
//   });
  
//   return (
//     <div className="absolute left-0 top-0 w-20 h-full pointer-events-none">
//       {timeSlots.map((slot, index) => (
//         <motion.div
//           key={slot.time}
//           initial={{ opacity: 0, x: -10 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: index * 0.05 }}
//           className={`absolute left-0 w-full text-xs border-t transition-colors duration-200 ${
//             slot.isMajor 
//               ? 'border-gray-300 text-gray-700' 
//               : 'border-gray-100 text-gray-400'
//           }`}
//           style={{ top: `${index * slotHeight}px` }}
//         >
//           <div className="absolute -top-2 left-2 bg-white px-1 flex items-center space-x-1">
//             {slot.isMajor && <Clock size={10} />}
//             <span className={slot.isMajor ? 'font-medium' : ''}>
//               {slot.label}
//             </span>
//           </div>
//         </motion.div>
//       ))}
      
//       {/* Hour markers */}
//       {timeSlots.map((slot, index) => (
//         <div
//           key={`marker-${slot.time}`}
//           className={`absolute left-0 w-full h-px ${
//             slot.isMajor ? 'bg-gray-300' : 'bg-gray-100'
//           }`}
//           style={{ top: `${index * slotHeight}px` }}
//         />
//       ))}
//     </div>
//   );
// };

// export default TimelineGrid;
'use client';

import DroppableTimeSlot from './DroppableTimeSlot';
import { useMemo } from 'react';

const TimelineGrid = ({ 
  showTimeSlots = true, 
  startHour = 6, 
  endHour = 23, 
  slotHeight = 80,
  day = 'saturday',
  activities = [],
  onAddActivityToSlot,
  weekendDates = null
}) => {
  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, [startHour, endHour]);

  // Group activities by time slot
  const getActivitiesForSlot = (time) => {
    return activities.filter(activity => {
      if (!activity.time) return false;
      const activityTime = activity.time.substring(0, 5); // Get HH:MM part
      return activityTime === time;
    });
  };

  if (!showTimeSlots) return null;

  return (
    <div className="absolute left-0 top-0 w-28 h-full">
      {timeSlots.map((time, index) => {
        const slotActivities = getActivitiesForSlot(time);
        
        return (
          <DroppableTimeSlot
            key={`${day}-${time}`}
            time={time}
            day={day}
            height={slotHeight}
            hasActivity={slotActivities.length > 0}
            activities={slotActivities}
            onAddActivity={(selectedTime) => onAddActivityToSlot && onAddActivityToSlot(selectedTime)}
            weekendDates={weekendDates}
          />
        );
      })}
    </div>
  );
};

export default TimelineGrid;