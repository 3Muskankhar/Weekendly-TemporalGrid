'use client';

import { useEffect, useCallback } from 'react';
import { 
  schedulePersistence, 
  preferencesPersistence, 
  activityHistoryPersistence,
  statsPersistence,
  autoSave 
} from '@/utils/persistence';

// Custom hook for managing persistence
export const usePersistence = () => {
  // Auto-save functionality
  const enableAutoSave = useCallback((saveCallback, interval = 30000) => {
    autoSave.enable(saveCallback, interval);
  }, []);
  
  const disableAutoSave = useCallback(() => {
    autoSave.disable();
  }, []);
  
  const isAutoSaveEnabled = useCallback(() => {
    return autoSave.isEnabled();
  }, []);
  
  // Schedule persistence
  const saveSchedule = useCallback((schedule) => {
    return schedulePersistence.saveSchedule(schedule);
  }, []);
  
  const loadSchedule = useCallback(() => {
    return schedulePersistence.loadSchedule();
  }, []);
  
  
  // Preferences persistence
  const savePreferences = useCallback((preferences) => {
    return preferencesPersistence.savePreferences(preferences);
  }, []);
  
  const loadPreferences = useCallback(() => {
    return preferencesPersistence.loadPreferences();
  }, []);
  
  const updatePreference = useCallback((key, value) => {
    return preferencesPersistence.updatePreference(key, value);
  }, []);
  
  // Activity history persistence
  const saveActivityToHistory = useCallback((activity) => {
    return activityHistoryPersistence.saveActivityToHistory(activity);
  }, []);
  
  const getActivityHistory = useCallback(() => {
    return activityHistoryPersistence.getActivityHistory();
  }, []);
  
  const clearActivityHistory = useCallback(() => {
    return activityHistoryPersistence.clearActivityHistory();
  }, []);
  
  // Statistics persistence
  const saveMoodStats = useCallback((stats) => {
    return statsPersistence.saveMoodStats(stats);
  }, []);
  
  const loadMoodStats = useCallback(() => {
    return statsPersistence.loadMoodStats();
  }, []);
  
  const saveStatusStats = useCallback((stats) => {
    return statsPersistence.saveStatusStats(stats);
  }, []);
  
  const loadStatusStats = useCallback(() => {
    return statsPersistence.loadStatusStats();
  }, []);
  
  return {
    // Auto-save
    enableAutoSave,
    disableAutoSave,
    isAutoSaveEnabled,
    
    // Schedule
    saveSchedule,
    loadSchedule,
    
    // Preferences
    savePreferences,
    loadPreferences,
    updatePreference,
    
    // Activity History
    saveActivityToHistory,
    getActivityHistory,
    clearActivityHistory,
    
    // Statistics
    saveMoodStats,
    loadMoodStats,
    saveStatusStats,
    loadStatusStats
  };
};

// Hook for auto-saving schedule changes
export const useAutoSave = (schedule, dependencies = []) => {
  const { saveSchedule, enableAutoSave, disableAutoSave } = usePersistence();
  
  useEffect(() => {
    // Enable auto-save when schedule changes
    enableAutoSave(() => {
      saveSchedule(schedule);
    }, 30000); // Save every 30 seconds
    
    // Cleanup on unmount
    return () => {
      disableAutoSave();
    };
  }, [schedule, disableAutoSave, enableAutoSave, saveSchedule, dependencies]);
  
  return {
    enableAutoSave,
    disableAutoSave
  };
};

// Hook for managing user preferences
export const useUserPreferences = () => {
  const { 
    loadPreferences, 
    savePreferences, 
    updatePreference 
  } = usePersistence();
  
  const preferences = loadPreferences();
  
  const setPreference = useCallback((key, value) => {
    updatePreference(key, value);
  }, [updatePreference]);
  
  const resetPreferences = useCallback(() => {
    const defaultPreferences = {
      theme: 'light',
      defaultMood: 'happy',
      defaultStatus: 'pending',
      showTimeSlots: true,
      viewMode: 'grid',
      notifications: true,
      autoSave: true
    };
    savePreferences(defaultPreferences);
  }, [savePreferences]);
  
  return {
    preferences,
    setPreference,
    resetPreferences
  };
};

// Hook for activity history
export const useActivityHistory = () => {
  const { 
    saveActivityToHistory, 
    getActivityHistory, 
    clearActivityHistory 
  } = usePersistence();
  
  const history = getActivityHistory();
  
  const addToHistory = useCallback((activity) => {
    saveActivityToHistory(activity);
  }, [saveActivityToHistory]);
  
  const clearHistory = useCallback(() => {
    clearActivityHistory();
  }, [clearActivityHistory]);
  
  const getRecentActivities = useCallback((limit = 10) => {
    return history.slice(0, limit);
  }, [history]);
  
  const getActivitiesByCategory = useCallback((category) => {
    return history.filter(activity => activity.category === category);
  }, [history]);
  
  const getActivitiesByMood = useCallback((mood) => {
    return history.filter(activity => activity.mood === mood);
  }, [history]);
  
  return {
    history,
    addToHistory,
    clearHistory,
    getRecentActivities,
    getActivitiesByCategory,
    getActivitiesByMood
  };
};

// Hook for statistics persistence
export const useStatsPersistence = () => {
  const { 
    saveMoodStats, 
    loadMoodStats, 
    saveStatusStats, 
    loadStatusStats 
  } = usePersistence();
  
  const moodStats = loadMoodStats();
  const statusStats = loadStatusStats();
  
  const updateMoodStats = useCallback((newStats) => {
    const updatedStats = {
      ...moodStats,
      ...newStats,
      lastUpdated: new Date().toISOString()
    };
    saveMoodStats(updatedStats);
  }, [moodStats, saveMoodStats]);
  
  const updateStatusStats = useCallback((newStats) => {
    const updatedStats = {
      ...statusStats,
      ...newStats,
      lastUpdated: new Date().toISOString()
    };
    saveStatusStats(updatedStats);
  }, [statusStats, saveStatusStats]);
  
  return {
    moodStats,
    statusStats,
    updateMoodStats,
    updateStatusStats
  };
};

export default usePersistence;
