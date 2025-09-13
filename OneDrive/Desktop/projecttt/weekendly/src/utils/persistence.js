// Enhanced persistence utilities for Weekendly

const STORAGE_KEYS = {
  WEEKEND_SCHEDULE: 'weekendly-schedule',
  USER_PREFERENCES: 'weekendly-preferences',
  ACTIVITY_HISTORY: 'weekendly-activity-history',
  MOOD_STATS: 'weekendly-mood-stats',
  STATUS_STATS: 'weekendly-status-stats',
  BACKUP_DATA: 'weekendly-backup-data'
};

// Storage utilities
export const storageUtils = {
  // Save data to localStorage with error handling
  save: (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error);
      return false;
    }
  },

  // Load data from localStorage with error handling
  load: (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data from localStorage (${key}):`, error);
      return false;
    }
  },

  // Clear all Weekendly data
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing all Weekendly data:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: () => {
    try {
      const testKey = '__weekendly_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get storage usage information
  getStorageInfo: () => {
    try {
      let totalSize = 0;
      const storageInfo = {};
      
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const data = localStorage.getItem(key);
        if (data) {
          const size = new Blob([data]).size;
          storageInfo[name] = {
            key,
            size,
            sizeFormatted: formatBytes(size)
          };
          totalSize += size;
        }
      });
      
      return {
        totalSize,
        totalSizeFormatted: formatBytes(totalSize),
        items: storageInfo,
        available: storageUtils.isAvailable()
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }
};

// Schedule persistence
export const schedulePersistence = {
  // Save weekend schedule
  saveSchedule: (schedule) => {
    return storageUtils.save(STORAGE_KEYS.WEEKEND_SCHEDULE, schedule);
  },

  // Load weekend schedule
  loadSchedule: () => {
    return storageUtils.load(STORAGE_KEYS.WEEKEND_SCHEDULE, {
      saturday: [],
      sunday: []
    });
  },

};

// User preferences persistence
export const preferencesPersistence = {
  // Save user preferences
  savePreferences: (preferences) => {
    return storageUtils.save(STORAGE_KEYS.USER_PREFERENCES, preferences);
  },

  // Load user preferences
  loadPreferences: () => {
    return storageUtils.load(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      defaultMood: 'happy',
      defaultStatus: 'pending',
      showTimeSlots: true,
      viewMode: 'grid',
      notifications: true,
      autoSave: true
    });
  },

  // Update specific preference
  updatePreference: (key, value) => {
    const preferences = preferencesPersistence.loadPreferences();
    preferences[key] = value;
    return preferencesPersistence.savePreferences(preferences);
  }
};

// Activity history persistence
export const activityHistoryPersistence = {
  // Save activity to history
  saveActivityToHistory: (activity) => {
    const history = storageUtils.load(STORAGE_KEYS.ACTIVITY_HISTORY, []);
    
    // Add activity with timestamp
    const historyEntry = {
      ...activity,
      addedAt: new Date().toISOString(),
      id: `${activity.id}-${Date.now()}`
    };
    
    history.unshift(historyEntry);
    
    // Keep last 100 activities
    if (history.length > 100) {
      history.splice(100);
    }
    
    return storageUtils.save(STORAGE_KEYS.ACTIVITY_HISTORY, history);
  },

  // Get activity history
  getActivityHistory: () => {
    return storageUtils.load(STORAGE_KEYS.ACTIVITY_HISTORY, []);
  },

  // Clear activity history
  clearActivityHistory: () => {
    return storageUtils.remove(STORAGE_KEYS.ACTIVITY_HISTORY);
  }
};

// Statistics persistence
export const statsPersistence = {
  // Save mood statistics
  saveMoodStats: (stats) => {
    return storageUtils.save(STORAGE_KEYS.MOOD_STATS, stats);
  },

  // Load mood statistics
  loadMoodStats: () => {
    return storageUtils.load(STORAGE_KEYS.MOOD_STATS, {
      totalActivities: 0,
      moodDistribution: {},
      weeklyTrends: [],
      lastUpdated: null
    });
  },

  // Save status statistics
  saveStatusStats: (stats) => {
    return storageUtils.save(STORAGE_KEYS.STATUS_STATS, stats);
  },

  // Load status statistics
  loadStatusStats: () => {
    return storageUtils.load(STORAGE_KEYS.STATUS_STATS, {
      totalActivities: 0,
      completionRate: 0,
      statusDistribution: {},
      weeklyTrends: [],
      lastUpdated: null
    });
  }
};

// Data export/import utilities
export const dataUtils = {
  // Export all data
  exportAllData: () => {
    const data = {
      schedule: schedulePersistence.loadSchedule(),
      preferences: preferencesPersistence.loadPreferences(),
      activityHistory: activityHistoryPersistence.getActivityHistory(),
      moodStats: statsPersistence.loadMoodStats(),
      statusStats: statsPersistence.loadStatusStats(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  },

  // Import data
  importData: (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate data structure
      if (!data.schedule || !data.preferences) {
        throw new Error('Invalid data format');
      }
      
      // Save imported data
      const results = {
        schedule: schedulePersistence.saveSchedule(data.schedule),
        preferences: preferencesPersistence.savePreferences(data.preferences),
        activityHistory: data.activityHistory ? 
          storageUtils.save(STORAGE_KEYS.ACTIVITY_HISTORY, data.activityHistory) : true,
        moodStats: data.moodStats ? 
          statsPersistence.saveMoodStats(data.moodStats) : true,
        statusStats: data.statusStats ? 
          statsPersistence.saveStatusStats(data.statusStats) : true
      };
      
      return {
        success: true,
        results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Download data as file
  downloadData: (data, filename = 'weekendly-backup.json') => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Helper function to format bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Auto-save functionality
export const autoSave = {
  // Enable auto-save
  enable: (callback, interval = 30000) => { // 30 seconds
    if (autoSave.intervalId) {
      clearInterval(autoSave.intervalId);
    }
    
    autoSave.intervalId = setInterval(() => {
      if (callback) {
        callback();
      }
    }, interval);
  },

  // Disable auto-save
  disable: () => {
    if (autoSave.intervalId) {
      clearInterval(autoSave.intervalId);
      autoSave.intervalId = null;
    }
  },

  // Check if auto-save is enabled
  isEnabled: () => {
    return autoSave.intervalId !== null;
  }
};

const persistenceUtils = {
  storageUtils,
  schedulePersistence,
  preferencesPersistence,
  activityHistoryPersistence,
  statsPersistence,
  dataUtils,
  autoSave
};

export default persistenceUtils;
