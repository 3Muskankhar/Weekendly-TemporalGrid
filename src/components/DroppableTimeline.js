// 'use client';

// import { useDroppable } from '@dnd-kit/core';
// import { motion } from 'framer-motion';
// import { Plus, Calendar } from 'lucide-react';
// import { Card } from '@/components/ui';

// const DroppableTimeline = ({ 
//   day, 
//   children, 
//   isOver, 
//   isEmpty = false,
//   onAddActivity 
// }) => {
//   const { setNodeRef } = useDroppable({
//     id: `timeline-${day}`,
//     data: {
//       type: 'timeline',
//       day,
//     },
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`relative min-h-[600px] rounded-2xl transition-all duration-200 ${
//         isOver ? 'bg-coral-50 border-2 border-dashed border-coral-300' : 'bg-white'
//       }`}
//     >
//       {/* Drop Zone Overlay */}
//       {isOver && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="absolute inset-0 bg-coral-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Calendar className="w-8 h-8 text-coral-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-coral-800 mb-2">
//               Drop activity here
//             </h3>
//             <p className="text-coral-600">
//               Add to {day.charAt(0).toUpperCase() + day.slice(1)} schedule
//             </p>
//           </div>
//         </motion.div>
//       )}
      
//       {/* Empty State */}
//       {isEmpty && !isOver && (
//         <div className="flex-1 flex items-center justify-center p-12">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Plus className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-600 mb-2">
//               No activities planned for {day}
//             </h3>
//             <p className="text-gray-500 mb-4">
//               Drag activities here or add from the browser
//             </p>
//             <button
//               onClick={onAddActivity}
//               className="text-coral-600 hover:text-coral-700 font-medium text-sm"
//             >
//               Browse Activities
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Timeline Content */}
//       <div className="relative">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default DroppableTimeline;
'use client';

import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';

const DroppableTimeline = ({ 
  day, 
  children, 
  isEmpty = false, 
  onAddActivity 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `timeline-${day}`,
    data: {
      type: 'timeline',
      day,
    },
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`relative min-h-[600px] rounded-2xl transition-all duration-200 ${
        isOver ? 'bg-coral-50 border-2 border-dashed border-coral-300' : 'bg-white'
      }`}
    >
      {/* Drop Zone Overlay */}
      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-coral-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-coral-600" />
            </div>
            <h3 className="text-lg font-semibold text-coral-800 mb-2">
              Drop activity here
            </h3>
            <p className="text-coral-600">
              Add to {day.charAt(0).toUpperCase() + day.slice(1)} schedule
            </p>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {isEmpty && !isOver && (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No activities planned for {day}
            </h3>
            <p className="text-gray-500 mb-4">
              Drag activities here or add from the browser
            </p>
            {onAddActivity && (
              <button
                onClick={onAddActivity}
                className="text-coral-600 hover:text-coral-700 font-medium text-sm hover:underline"
              >
                Browse Activities
              </button>
            )}
          </div>
        </div>
      )}

      {/* Timeline Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default DroppableTimeline;
