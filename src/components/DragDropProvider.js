'use client';

import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeekendSchedule } from '@/hooks';
import { timeUtils } from '@/utils/scheduleUtils';

const DragDropProvider = ({ children }) => {
  const {
    weekendSchedule,
    selectedDay,
    moveActivity,
    reorderActivities,
    setDraggedActivity
  } = useWeekendSchedule();
  
  const [activeId, setActiveId] = useState(null);
  const [activeData, setActiveData] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveData(active.data.current);
    setDraggedActivity(active.data.current?.activity);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Handle different drop scenarios
    // Note: do not mutate schedule during dragOver to avoid flicker
    
    // For timeslot hover we only provide visual feedback handled by droppable
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveData(null);
    setDraggedActivity(null);
    
    if (!over) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // Handle reordering within the same day
    if (activeData?.type === 'scheduled-activity' && overData?.type === 'scheduled-activity') {
      if (activeData.day === overData.day) {
        const day = activeData.day;
        const activities = weekendSchedule[day] || [];
        const oldIndex = activities.findIndex(a => a.id === activeData.activity.id);
        const newIndex = activities.findIndex(a => a.id === overData.activity.id);
        
        if (oldIndex !== newIndex) {
          const newOrder = arrayMove(activities, oldIndex, newIndex);
          reorderActivities(day, newOrder);
        }
      }
    }
    
    // Handle moving between days
    if (activeData?.type === 'scheduled-activity' && overData?.type === 'timeline') {
      const activity = activeData.activity;
      const fromDay = activeData.day;
      const toDay = overData.day;
      
      if (fromDay !== toDay) {
        // Find next available time in target day
        const targetActivities = weekendSchedule[toDay] || [];
        const availableTime = timeUtils.minutesToTime(9 * 60); // default 09:00, could be improved with smart search
        
        moveActivity(activity.id, fromDay, toDay, availableTime);
      }
    }

    // Handle adding available activity from browser to timeline (day area)
    if (activeData?.type === 'activity' && overData?.type === 'timeline') {
      const activity = activeData.activity;
      const toDay = overData.day;
      const availableTime = timeUtils.minutesToTime(9 * 60);
      // Since item isn't scheduled yet, create a new scheduled entry via addActivity
      // We can't move from 'browser', use add flow via hook actions
      // Using window.dispatchEvent is not ideal; instead consumers should handle onDragEnd.
      // Here we simulate by calling a custom event. For simplicity, we do nothing here
      // because add is typically triggered by drop on timeslot below.
    }

    // Handle dropping onto a specific timeslot
    if (overData?.type === 'timeslot') {
      const targetDay = overData.day;
      const targetTime = overData.time;

      if (activeData?.type === 'scheduled-activity') {
        const activity = activeData.activity;
        // Move within or across days to specific time
        moveActivity(activity.id, activeData.day, targetDay, targetTime);
      }
      if (activeData?.type === 'activity') {
        // New activity from browser: use addActivity via hook
        // Defer to a global custom event that WeekendSchedule listens to
        const detail = { activity: activeData.activity, day: targetDay, time: targetTime };
        window.dispatchEvent(new CustomEvent('schedule:addActivityAtTime', { detail }));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeData ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="transform rotate-3"
          >
            {activeData.type === 'activity' && (
              <div className="bg-white rounded-xl shadow-2xl border-2 border-coral-500 p-4 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                    <span className="text-coral-600 font-semibold">
                      {activeData.activity.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activeData.activity.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeData.activity.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeData.type === 'scheduled-activity' && (
              <div className="bg-white rounded-xl shadow-2xl border-2 border-coral-500 p-4 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                    <span className="text-coral-600 font-semibold">
                      {activeData.activity.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {activeData.activity.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeData.activity.time} • {activeData.activity.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropProvider;
