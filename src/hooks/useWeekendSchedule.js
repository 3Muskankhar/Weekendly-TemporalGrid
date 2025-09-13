'use client';

import { useWeekend } from '@/context/WeekendContext';
import { scheduleUtils, timeUtils } from '@/utils/scheduleUtils';

// Custom hook for weekend schedule operations
export function useWeekendSchedule() {
  const { state, actions } = useWeekend();
  
  // Get activities for a specific day
  const getDayActivities = (day) => {
    return scheduleUtils.sortActivitiesByTime(state.weekendSchedule[day] || []);
  };
  
  // Get all activities across both days
  const getAllActivities = () => {
    return {
      saturday: getDayActivities('saturday'),
      sunday: getDayActivities('sunday')
    };
  };
  
  // Check for time conflicts on a specific day
  const getTimeConflicts = (day) => {
    const activities = getDayActivities(day);
    return scheduleUtils.checkTimeConflicts(activities);
  };
  
  // Get next available time for a new activity
  const getNextAvailableTime = (day, duration, preferredTime = null) => {
    const activities = getDayActivities(day);
    return scheduleUtils.getNextAvailableTime(activities, duration, preferredTime);
  };
  
  // Get total duration for a day
  const getDayTotalDuration = (day) => {
    const activities = getDayActivities(day);
    return scheduleUtils.getTotalDuration(activities);
  };
  
  // Get activities by category for a day
  const getActivitiesByCategory = (day, category) => {
    const activities = getDayActivities(day);
    return scheduleUtils.getActivitiesByCategory(activities, category);
  };
  
  // Get activities by mood for a day
  const getActivitiesByMood = (day, mood) => {
    const activities = getDayActivities(day);
    return scheduleUtils.getActivitiesByMood(activities, mood);
  };
  
  // Get activities by status for a day
  const getActivitiesByStatus = (day, status) => {
    const activities = getDayActivities(day);
    return scheduleUtils.getActivitiesByStatus(activities, status);
  };
  
  // Add activity with smart time placement
  const addActivitySmart = (activity, day, preferredTime = null) => {
    const availableTime = getNextAvailableTime(day, activity.duration, preferredTime);
    if (availableTime) {
      actions.addActivity(activity, day, availableTime);
      return true;
    }
    return false;
  };
  
  // Move activity between days
  const moveActivityBetweenDays = (activityId, fromDay, toDay, newTime = null) => {
    const availableTime = newTime || getNextAvailableTime(toDay, 60); // Default 1 hour
    if (availableTime) {
      actions.moveActivity(activityId, fromDay, toDay, availableTime);
      return true;
    }
    return false;
  };
  
  // Update activity time with conflict checking
  const updateActivityTime = (activityId, day, newTime) => {
    const activity = state.weekendSchedule[day]?.find(a => a.id === activityId);
    if (!activity) return false;
    
    // Check if new time conflicts with other activities
    const otherActivities = getDayActivities(day).filter(a => a.id !== activityId);
    const conflicts = scheduleUtils.checkTimeConflicts([
      ...otherActivities,
      { ...activity, time: newTime }
    ]);
    
    if (conflicts.length === 0) {
      actions.updateActivity(activityId, day, { time: newTime });
      return true;
    }
    
    return false;
  };
  
  // Get schedule statistics
  const getScheduleStats = () => {
    const saturdayActivities = getDayActivities('saturday');
    const sundayActivities = getDayActivities('sunday');
    
    return {
      totalActivities: saturdayActivities.length + sundayActivities.length,
      saturday: {
        count: saturdayActivities.length,
        duration: scheduleUtils.getTotalDuration(saturdayActivities),
        conflicts: getTimeConflicts('saturday').length,
        activities: saturdayActivities
      },
      sunday: {
        count: sundayActivities.length,
        duration: scheduleUtils.getTotalDuration(sundayActivities),
        conflicts: getTimeConflicts('sunday').length,
        activities: sundayActivities
      },
      totalDuration: scheduleUtils.getTotalDuration(saturdayActivities) + 
                    scheduleUtils.getTotalDuration(sundayActivities)
    };
  };
  
  // Clear all activities for a day
  const clearDay = (day) => {
    const activities = getDayActivities(day);
    activities.forEach(activity => {
      actions.removeActivity(activity.id, day);
    });
  };
  
  // Clear entire weekend
  const clearWeekend = () => {
    clearDay('saturday');
    clearDay('sunday');
  };
  
  return {
    // State
    weekendSchedule: state.weekendSchedule,
    selectedDay: state.ui.selectedDay,
    
    // Getters
    getDayActivities,
    getAllActivities,
    getTimeConflicts,
    getNextAvailableTime,
    getDayTotalDuration,
    getActivitiesByCategory,
    getActivitiesByMood,
    getActivitiesByStatus,
    getScheduleStats,
    
    // Actions
    addActivity: actions.addActivity,
    addActivitySmart,
    removeActivity: actions.removeActivity,
    updateActivity: actions.updateActivity,
    updateActivityTime,
    moveActivity: actions.moveActivity,
    moveActivityBetweenDays,
    reorderActivities: actions.reorderActivities,
    setSelectedDay: actions.setSelectedDay,
    clearDay,
    clearWeekend,
    
    // UI Actions
    openModal: actions.openModal,
    closeModal: actions.closeModal,
    setEditingActivity: actions.setEditingActivity,
    setDraggedActivity: actions.setDraggedActivity,
    
    // UI State
    isModalOpen: state.ui.isModalOpen,
    editingActivity: state.ui.editingActivity,
    draggedActivity: state.ui.draggedActivity
  };
}
