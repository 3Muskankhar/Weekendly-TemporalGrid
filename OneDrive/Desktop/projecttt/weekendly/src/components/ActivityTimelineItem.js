'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, MoreVertical, Clock, MapPin } from 'lucide-react';
import { Card, Badge, Button, Icon } from '@/components/ui';
import { timeUtils } from '@/utils/scheduleUtils';
import StatusIndicator from './StatusIndicator';

const ActivityTimelineItem = ({ 
  activity, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  isExpanded = false,
  onToggleExpand,
  weekendDates = null
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if this activity is in the past
  const isPastActivity = () => {
    if (!weekendDates || !activity.time) return false;
    
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0];
    
    // Check if the day is today and time is in the past
    if (activity.day === 'saturday' && timeUtils.isToday(weekendDates.start)) {
      return timeUtils.isTimeInPast(activity.time, weekendDates.start);
    }
    if (activity.day === 'sunday' && timeUtils.isToday(weekendDates.end)) {
      return timeUtils.isTimeInPast(activity.time, weekendDates.end);
    }
    
    // Check if the day is in the past
    if (activity.day === 'saturday' && timeUtils.isDateInPast(weekendDates.start)) {
      return true;
    }
    if (activity.day === 'sunday' && timeUtils.isDateInPast(weekendDates.end)) {
      return true;
    }
    
    return false;
  };

  const isPast = isPastActivity();
  
  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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
  
  // Get status color and icon
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { color: 'gray', icon: 'pending' },
      inProgress: { color: 'blue', icon: 'inProgress' },
      done: { color: 'green', icon: 'done' },
      cancelled: { color: 'red', icon: 'cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  };
  
  // Get mood color
  const getMoodColor = (mood) => {
    const moodMap = {
      happy: 'yellow',
      relaxed: 'green',
      energetic: 'orange',
      focused: 'blue',
      creative: 'purple',
      social: 'pink'
    };
    return moodMap[mood] || 'gray';
  };
  
  const categoryColor = getCategoryColor(activity.category);
  const statusInfo = getStatusInfo(activity.status);
  const moodColor = getMoodColor(activity.mood);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full"
      onMouseEnter={() => {
        if (!isHovered) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (isHovered) setIsHovered(false);
      }}
    >
      <Card
        variant="default"
        className={`h-full p-4 ${isPast ? 'cursor-not-allowed opacity-60 bg-gray-50' : 'cursor-pointer hover:shadow-lg'} group transition-all duration-200 border-l-4 border-l-${categoryColor}-500 relative overflow-hidden`}
        onClick={isPast ? undefined : onToggleExpand}
      >
        {/* Background Pattern */}
        <div className={`absolute inset-0 bg-gradient-to-r from-${categoryColor}-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
        
        <div className="relative h-full flex flex-col">
          {/* Activity Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className={`w-10 h-10 bg-${categoryColor}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                <Icon 
                  name={activity.icon} 
                  size={20} 
                  color={`${categoryColor}-600`}
                  animate
                />
              </div>
              
              {/* Title and Time */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-coral-600 transition-colors">
                  {activity.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{timeUtils.formatAmPm(activity.time)}</span>
                  <span>•</span>
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-2">
              <StatusIndicator
                status={activity.status}
                onStatusChange={(newStatus) => {
                  onToggleStatus?.(activity, newStatus);
                  if (newStatus === 'done') {
                    // Open a vibe selection modal in the planner
                    window.dispatchEvent(new CustomEvent('vibe:open', { detail: { activityId: activity.id, day: activity.day, name: activity.name } }));
                  }
                }}
                size="sm"
                interactive={true}
              />
            </div>
          </div>
          
          {/* Activity Details */}
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Category Badge */}
              <Badge
                variant="default"
                size="sm"
                className={`bg-${categoryColor}-100 text-${categoryColor}-800 hover:bg-${categoryColor}-200 transition-colors`}
              >
                {activity.category}
              </Badge>
              
              {/* Mood Badge */}
              <Badge
                variant="default"
                size="sm"
                className={`bg-${moodColor}-100 text-${moodColor}-800 hover:bg-${moodColor}-200 transition-colors`}
              >
                {activity.mood}
              </Badge>
            </div>
            
            {/* Action Buttons */}
            <AnimatePresence>
              {(isHovered || isExpanded) && !isPast && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center space-x-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Dispatch edit event for the planner to handle
                      window.dispatchEvent(new CustomEvent('activity:edit', { detail: { activity } }));
                    }}
                    className="w-12 h-12 p-0 hover:bg-coral-100 hover:text-coral-600"
                  >
                    <Edit3 size={30} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDelete) {
                        onDelete(activity);
                      }
                    }}
                    className="w-12 h-12 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 size={30} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="space-y-3">
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock size={12} />
                      <span>Duration: {formatDuration(activity.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500">
                      <MapPin size={12} />
                      <span>Category: {activity.category}</span>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  {activity.status === 'inProgress' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>In Progress</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActivityTimelineItem;
