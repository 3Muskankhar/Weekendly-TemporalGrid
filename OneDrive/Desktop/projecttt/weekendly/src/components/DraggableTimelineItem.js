// 'use client';

// import { useDraggable } from '@dnd-kit/core';
// import { motion } from 'framer-motion';
// import { GripVertical } from 'lucide-react';
// import ActivityTimelineItem from './ActivityTimelineItem';

// const DraggableTimelineItem = ({ 
//   activity, 
//   onEdit, 
//   onDelete, 
//   onToggleStatus,
//   isExpanded = false,
//   onToggleExpand 
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     isDragging,
//   } = useDraggable({
//     id: `scheduled-activity-${activity.id}`,
//     data: {
//       type: 'scheduled-activity',
//       activity,
//       day: activity.day,
//     },
//   });

//   const style = transform ? {
//     transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
//   } : undefined;

//   return (
//     <motion.div
//       ref={setNodeRef}
//       style={style}
//       className={`relative ${isDragging ? 'z-50' : ''}`}
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ 
//         opacity: isDragging ? 0.8 : 1, 
//         scale: isDragging ? 1.05 : 1 
//       }}
//       transition={{ type: "spring", stiffness: 300, damping: 20 }}
//     >
//       {/* Drag Handle */}
//       <div
//         className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
//         {...listeners}
//         {...attributes}
//       >
//         <GripVertical size={12} className="text-gray-600" />
//       </div>
      
//       <ActivityTimelineItem
//         activity={activity}
//         onEdit={onEdit}
//         onDelete={onDelete}
//         onToggleStatus={onToggleStatus}
//         isExpanded={isExpanded}
//         onToggleExpand={onToggleExpand}
//         className={`${isDragging ? 'shadow-2xl border-2 border-coral-500' : ''}`}
//       />
//     </motion.div>
//   );
// };

// export default DraggableTimelineItem;
'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import ActivityTimelineItem from './ActivityTimelineItem';

const DraggableTimelineItem = ({ 
  activity, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  isExpanded = false, 
  onToggleExpand,
  weekendDates = null
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `scheduled-activity-${activity.id}`,
    data: {
      type: 'scheduled-activity',
      activity,
      day: activity.day,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
  } : undefined;

  return (
    <div className="relative group">
      <motion.div
        ref={setNodeRef}
        style={style}
        className={`relative ${isDragging ? 'opacity-50 z-50' : ''}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isDragging ? 0.5 : 1, 
          scale: isDragging ? 1.05 : 1 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Drag Handle */}
        <div
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white shadow-md border border-gray-200 hover:border-coral-400 hover:bg-coral-50 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
          {...listeners}
          {...attributes}
          title="Drag to reschedule"
        >
          <GripVertical size={12} className="text-gray-600 hover:text-coral-600" />
        </div>
        
        <ActivityTimelineItem
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          weekendDates={weekendDates}
          className={`transition-all duration-200 ${isDragging ? 'shadow-2xl border-2 border-coral-400 bg-coral-50' : ''}`}
        />
      </motion.div>
    </div>
  );
};

export default DraggableTimelineItem;
