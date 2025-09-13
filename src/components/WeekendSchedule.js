'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useWeekendSchedule, useActivities } from '@/hooks';
import { timeUtils } from '@/utils/scheduleUtils';
import ActivityTimelineItem from './ActivityTimelineItem';
import DraggableTimelineItem from './DraggableTimelineItem';
import TimelineGrid from './TimelineGrid';
import ScheduleStats from './ScheduleStats';
import DroppableTimeline from './DroppableTimeline';
import { useDroppable } from '@dnd-kit/core';

const WeekendSchedule = ({ weekendDates }) => {
  const {
    weekendSchedule,
    selectedDay,
    setSelectedDay,
    getDayActivities,
    addActivity,
    removeActivity,
    updateActivity,
    updateActivity: updateActivityDirect,
    getTimeConflicts,
    getDayTotalDuration,
    getScheduleStats,
    openModal,
    setEditingActivity
  } = useWeekendSchedule();
  
  const { getMoodById, getStatusById } = useActivities();
  
  // Local state
  const [showTimeSlots, setShowTimeSlots] = useState(true);
  const [expandedActivity, setExpandedActivity] = useState(null);
  
  // Get activities for the selected day
  const dayActivities = getDayActivities(selectedDay);
  const timeConflicts = getTimeConflicts(selectedDay);
  const totalDuration = getDayTotalDuration(selectedDay);
  const scheduleStats = getScheduleStats();
  
  // Listen for DnD add-from-browser at specific time
  useEffect(() => {
    const handler = (e) => {
      const { activity, day, time } = e.detail || {};
      if (activity && day && time) {
        addActivity(activity, day, time);
      }
    };
    window.addEventListener('schedule:addActivityAtTime', handler);
    return () => window.removeEventListener('schedule:addActivityAtTime', handler);
  }, [addActivity]);

  // Listen for vibe set
  useEffect(() => {
    const vibeHandler = (e) => {
      const { activityId, day, vibe } = e.detail || {};
      if (activityId && day && vibe) {
        updateActivity(activityId, day, { mood: vibe });
      }
    };
    window.addEventListener('activity:setVibe', vibeHandler);
    return () => window.removeEventListener('activity:setVibe', vibeHandler);
  }, [updateActivity]);

  // Generate time slots for the day (6 AM to 11 PM)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      label: hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`
    };
  });
  
  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  // Get activity position and height for timeline
  const getActivityPosition = (activity) => {
    const startMinutes = timeUtils.timeToMinutes(activity.time);
    const startHour = Math.floor(startMinutes / 60);
    const startMinute = startMinutes % 60;
    
    // Calculate position from 6 AM (360 minutes)
    const startPosition = (startMinutes - 360) / 60; // Convert to hours from 6 AM
    const height = activity.duration / 60; // Convert duration to hours
    
    return {
      top: `${startPosition * 80}px`, // 80px per hour
      height: `${height * 80}px`,
      startHour,
      startMinute
    };
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      food: 'coral',
      outdoor: 'green',
      entertainment: 'purple',
      relaxation: 'blue',
      social: 'pink',
      creative: 'orange',
      errands: 'gray'
    };
    return colors[category] || 'gray';
  };
  
  // Handle activity actions
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    openModal();
  };
  
  const handleDeleteActivity = (activity) => {
    if (confirm(`Are you sure you want to remove "${activity.name}" from your schedule?`)) {
      removeActivity(activity.id, selectedDay);
    }
  };
  
  const handleToggleStatus = (activity, newStatus = null) => {
    if (newStatus) {
      updateActivity(activity.id, selectedDay, { status: newStatus });
    } else {
      const currentStatus = activity.status;
      const statuses = ['pending', 'inProgress', 'done', 'cancelled'];
      const currentIndex = statuses.indexOf(currentStatus);
      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
      
      updateActivity(activity.id, selectedDay, { status: nextStatus });
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Weekend Schedule{weekendDates?.start && weekendDates?.end ? ` • ${weekendDates.start} → ${weekendDates.end}` : ''}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTimeSlots(!showTimeSlots)}
              className="p-2"
            >
              <Clock size={16} />
            </Button>
          </div>
        </div>
        
        {/* Day Tabs */}
        <div className="flex space-x-2">
          {['saturday', 'sunday'].map((day) => {
            const dayStats = scheduleStats[day];
            const isSelected = selectedDay === day;
            
            return (
              <motion.div
                key={day}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setSelectedDay(day)}
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <Calendar size={16} />
                  <span className="capitalize">{day}</span>
                  {dayStats.count > 0 && (
                    <Badge variant="default" size="sm" className="ml-2">
                      {dayStats.count}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Day Stats */}
        <div className="mt-4">
          <ScheduleStats
            dayStats={scheduleStats[selectedDay]}
            timeConflicts={timeConflicts}
            totalDuration={totalDuration}
            activityCount={dayActivities.length}
          />
        </div>
      </div>
      
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <DroppableTimeline
          day={selectedDay}
          isEmpty={dayActivities.length === 0}
          onAddActivity={() => console.log('Browse activities')}
        >
          {/* Timeline Grid */}
          <TimelineGrid 
            showTimeSlots={showTimeSlots}
            startHour={6}
            endHour={23}
            slotHeight={80}
            day={selectedDay}
            activities={dayActivities}
            onAddActivityToSlot={() => {}}
            weekendDates={weekendDates}
          />
          
          {/* Activities Timeline */}
          <div className={`relative ${showTimeSlots ? 'ml-28' : 'ml-0'}`}>
            <AnimatePresence>
              {dayActivities.map((activity, index) => {
                const position = getActivityPosition(activity);
                const isExpanded = expandedActivity === activity.id;
                
                return (
                  <div
                    key={activity.id}
                    className="absolute w-full"
                    style={{
                      top: position.top,
                      height: position.height
                    }}
                  >
                    <DraggableTimelineItem
                      activity={activity}
                      onEdit={handleEditActivity}
                      onDelete={handleDeleteActivity}
                      onToggleStatus={handleToggleStatus}
                      isExpanded={isExpanded}
                      onToggleExpand={() => setExpandedActivity(isExpanded ? null : activity.id)}
                      weekendDates={weekendDates}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </DroppableTimeline>
      </div>
      
      {/* Footer */}
      <div className="p-3 md:p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Schedule
          </span>
          <span>
            {formatDuration(totalDuration)} planned
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeekendSchedule;
