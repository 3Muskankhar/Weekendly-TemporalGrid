// Utility functions for schedule management

// Time utilities
export const timeUtils = {
  // Convert time string (HH:MM) to minutes since midnight
  timeToMinutes: (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  },
  
  // Convert minutes since midnight to time string (HH:MM)
  minutesToTime: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  },

  // Format 24h time string (HH:MM) to 12h with AM/PM
  formatAmPm: (timeString) => {
    if (!timeString) return '';
    const [hStr, mStr] = timeString.split(':');
    const hour = parseInt(hStr, 10);
    const minute = mStr || '00';
    if (hour === 0) return `12:${minute} AM`;
    if (hour < 12) return `${hour}:${minute} AM`;
    if (hour === 12) return `12:${minute} PM`;
    return `${hour - 12}:${minute} PM`;
  },
  
  // Add duration to a time
  addDuration: (timeString, durationMinutes) => {
    const totalMinutes = timeUtils.timeToMinutes(timeString) + durationMinutes;
    return timeUtils.minutesToTime(totalMinutes);
  },
  
  // Check if two time ranges overlap
  timeRangesOverlap: (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  },
  
  // Generate time slots for the day
  generateTimeSlots: (startHour = 6, endHour = 23, interval = 30) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          value: timeString,
          label: timeString,
          display: timeString
        });
      }
    }
    return slots;
  },

  // Get current time in HH:MM format
  getCurrentTime: () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // Check if a time is in the past
  isTimeInPast: (timeString, date = null) => {
    const now = new Date();
    const targetDate = date ? new Date(date) : now;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const targetTime = new Date(targetDate);
    targetTime.setHours(hours, minutes, 0, 0);
    
    return targetTime < now;
  },

  // Check if a date is today
  isToday: (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    
    return today.toDateString() === targetDate.toDateString();
  },

  // Check if a date is in the past
  isDateInPast: (dateString) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    return targetDate < today;
  }
};

// Schedule utilities
export const scheduleUtils = {
  // Sort activities by time
  sortActivitiesByTime: (activities) => {
    return [...activities].sort((a, b) => {
      return timeUtils.timeToMinutes(a.time) - timeUtils.timeToMinutes(b.time);
    });
  },
  
  // Check for time conflicts
  checkTimeConflicts: (activities) => {
    const sortedActivities = scheduleUtils.sortActivitiesByTime(activities);
    const conflicts = [];
    
    for (let i = 0; i < sortedActivities.length - 1; i++) {
      const current = sortedActivities[i];
      const next = sortedActivities[i + 1];
      
      const currentEnd = timeUtils.addDuration(current.time, current.duration);
      const nextStart = next.time;
      
      if (timeUtils.timeToMinutes(currentEnd) > timeUtils.timeToMinutes(nextStart)) {
        conflicts.push({
          activity1: current,
          activity2: next,
          overlap: timeUtils.timeToMinutes(currentEnd) - timeUtils.timeToMinutes(nextStart)
        });
      }
    }
    
    return conflicts;
  },
  
  // Get next available time slot
  getNextAvailableTime: (activities, duration, preferredTime = null) => {
    const sortedActivities = scheduleUtils.sortActivitiesByTime(activities);
    
    if (preferredTime) {
      const preferredMinutes = timeUtils.timeToMinutes(preferredTime);
      const preferredEnd = preferredMinutes + duration;
      
      // Check if preferred time is available
      let isAvailable = true;
      for (const activity of sortedActivities) {
        const activityStart = timeUtils.timeToMinutes(activity.time);
        const activityEnd = activityStart + activity.duration;
        
        if (timeUtils.timeRangesOverlap(preferredMinutes, preferredEnd, activityStart, activityEnd)) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        return preferredTime;
      }
    }
    
    // Find next available slot
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = timeUtils.minutesToTime(hour * 60 + minute);
        const timeMinutes = timeUtils.timeToMinutes(timeString);
        const timeEnd = timeMinutes + duration;
        
        let isAvailable = true;
        for (const activity of sortedActivities) {
          const activityStart = timeUtils.timeToMinutes(activity.time);
          const activityEnd = activityStart + activity.duration;
          
          if (timeUtils.timeRangesOverlap(timeMinutes, timeEnd, activityStart, activityEnd)) {
            isAvailable = false;
            break;
          }
        }
        
        if (isAvailable) {
          return timeString;
        }
      }
    }
    
    return null; // No available time found
  },
  
  // Calculate total duration for a day
  getTotalDuration: (activities) => {
    return activities.reduce((total, activity) => total + activity.duration, 0);
  },
  
  // Get activities by category
  getActivitiesByCategory: (activities, category) => {
    return activities.filter(activity => activity.category === category);
  },
  
  // Get activities by mood
  getActivitiesByMood: (activities, mood) => {
    return activities.filter(activity => activity.mood === mood);
  },
  
  // Get activities by status
  getActivitiesByStatus: (activities, status) => {
    return activities.filter(activity => activity.status === status);
  }
};

// Validation utilities
export const validationUtils = {
  // Validate time format
  isValidTime: (timeString) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  },
  
  // Validate activity data
  validateActivity: (activity) => {
    const errors = [];
    
    if (!activity.name || activity.name.trim() === '') {
      errors.push('Activity name is required');
    }
    
    if (!activity.time || !validationUtils.isValidTime(activity.time)) {
      errors.push('Valid time is required');
    }
    
    if (!activity.duration || activity.duration <= 0) {
      errors.push('Valid duration is required');
    }
    
    if (!activity.mood) {
      errors.push('Mood selection is required');
    }
    
    if (!activity.status) {
      errors.push('Status selection is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export all utilities
const scheduleUtilsExport = {
  timeUtils,
  scheduleUtils,
  validationUtils
};

export default scheduleUtilsExport;
