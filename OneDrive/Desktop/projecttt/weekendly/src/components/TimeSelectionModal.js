// 'use client';

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Clock, Save } from 'lucide-react';
// import { useWeekendSchedule } from '../contexts/WeekendScheduleContext';

// const TimeSelectionModal = () => {
//   const { 
//     showTimeModal, 
//     setShowTimeModal, 
//     pendingActivity, 
//     confirmTimeSelection,
//     editingActivity,
//     updateActivity,
//     selectedDay
//   } = useWeekendSchedule();
  
//   const [selectedTime, setSelectedTime] = useState('09:00');
//   const [selectedDuration, setSelectedDuration] = useState('');

//   // Check if this is edit mode or add mode
//   const isEditMode = !!editingActivity;
//   const activity = editingActivity || pendingActivity?.activity;
//   const targetDay = editingActivity?.day || pendingActivity?.targetDay;

//   React.useEffect(() => {
//     if (editingActivity) {
//       setSelectedTime(editingActivity.time);
//       setSelectedDuration(editingActivity.duration.toString());
//     } else if (pendingActivity) {
//       setSelectedTime('09:00');
//       setSelectedDuration(pendingActivity.activity.duration.toString());
//     }
//   }, [editingActivity, pendingActivity]);

//   const handleSave = () => {
//     if (isEditMode) {
//       // Update existing activity
//       updateActivity(editingActivity.scheduledId, editingActivity.day, {
//         time: selectedTime,
//         duration: parseInt(selectedDuration)
//       });
//     } else {
//       // Add new activity
//       const updatedActivity = {
//         ...pendingActivity.activity,
//         duration: parseInt(selectedDuration)
//       };
//       confirmTimeSelection(selectedTime);
//     }
//     handleClose();
//   };

//   const handleClose = () => {
//     setShowTimeModal(false);
//     setSelectedTime('09:00');
//     setSelectedDuration('');
//   };

//   if (!showTimeModal || !activity) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           exit={{ opacity: 0, scale: 0.9, y: 20 }}
//           className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-bold text-gray-800">
//               {isEditMode ? 'Edit Activity' : 'Schedule Activity'}
//             </h3>
//             <button 
//               onClick={handleClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
          
//           {/* Activity Info */}
//           <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl mb-6">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//               <span className="text-blue-600 font-semibold text-lg">
//                 {activity.name.charAt(0)}
//               </span>
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-800">{activity.name}</h4>
//               <p className="text-sm text-gray-600 capitalize">{activity.category}</p>
//               <p className="text-xs text-gray-500">
//                 {isEditMode ? `Currently on ${targetDay}` : `Adding to ${targetDay}`}
//               </p>
//             </div>
//           </div>
          
//           <div className="space-y-4 mb-6">
//             {/* Time Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Start Time
//               </label>
//               <div className="flex items-center space-x-2">
//                 <Clock size={16} className="text-gray-500" />
//                 <input
//                   type="time"
//                   value={selectedTime}
//                   onChange={(e) => setSelectedTime(e.target.value)}
//                   className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             {/* Duration Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration (minutes)
//               </label>
//               <input
//                 type="number"
//                 value={selectedDuration}
//                 onChange={(e) => setSelectedDuration(e.target.value)}
//                 min="15"
//                 max="480"
//                 step="15"
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               <div className="flex space-x-2 mt-2">
//                 {[30, 60, 90, 120].map(duration => (
//                   <button
//                     key={duration}
//                     onClick={() => setSelectedDuration(duration.toString())}
//                     className={`px-3 py-1 text-xs rounded-full border transition-colors ${
//                       selectedDuration === duration.toString()
//                         ? 'bg-blue-500 text-white border-blue-500'
//                         : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
//                     }`}
//                   >
//                     {duration}m
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* End Time Display */}
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <div className="text-sm text-blue-800">
//                 <strong>End Time:</strong> {
//                   selectedTime && selectedDuration ? 
//                   calculateEndTime(selectedTime, parseInt(selectedDuration)) : 
//                   '--:--'
//                 }
//               </div>
//             </div>
//           </div>
          
//           <div className="flex space-x-3">
//             <button
//               onClick={handleClose}
//               className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={!selectedTime || !selectedDuration}
//               className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
//             >
//               <Save size={16} />
//               <span>{isEditMode ? 'Update' : 'Schedule'}</span>
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // Helper function to calculate end time
// const calculateEndTime = (startTime, duration) => {
//   const [hours, minutes] = startTime.split(':').map(Number);
//   const totalMinutes = hours * 60 + minutes + duration;
//   const endHours = Math.floor(totalMinutes / 60) % 24;
//   const endMins = totalMinutes % 60;
  
//   return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
// };

// export default TimeSelectionModal;
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

const TimeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  activity,
  selectedDay = 'saturday',
  suggestedTime = '09:00'
}) => {
  const [selectedTime, setSelectedTime] = useState(suggestedTime);
  const [duration, setDuration] = useState(activity?.defaultDuration || 60);

  if (!isOpen) return null;

  // Generate time options
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  const handleConfirm = () => {
    onConfirm({
      ...activity,
      time: selectedTime,
      duration,
      day: selectedDay
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-96 max-w-md shadow-xl"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-coral-600" size={24} />
          <h3 className="text-xl font-semibold">Schedule Activity</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity: {activity?.name}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day: {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Start Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="15"
              max="480"
              step="15"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700"
          >
            Schedule Activity
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TimeSelectionModal;