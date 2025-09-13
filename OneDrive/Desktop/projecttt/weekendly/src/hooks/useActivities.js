'use client';

import { useWeekend } from '@/context/WeekendContext';

// Custom hook for managing available activities
export function useActivities() {
  const { state } = useWeekend();
  
  // Get all available activities
  const getAvailableActivities = () => {
    return state.availableActivities;
  };
  
  // Get activity by ID
  const getActivityById = (id) => {
    return state.availableActivities.find(activity => activity.id === id);
  };
  
  // Get activities by category
  const getActivitiesByCategory = (category) => {
    return state.availableActivities.filter(activity => activity.category === category);
  };
  
  // Get all unique categories
  const getCategories = () => {
    const categories = state.availableActivities.map(activity => activity.category);
    return [...new Set(categories)];
  };
  
  // Search activities by name or description
  const searchActivities = (query) => {
    if (!query || query.trim() === '') {
      return state.availableActivities;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return state.availableActivities.filter(activity => 
      activity.name.toLowerCase().includes(lowercaseQuery) ||
      activity.description.toLowerCase().includes(lowercaseQuery) ||
      activity.category.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  // Get activities by duration range
  const getActivitiesByDuration = (minDuration, maxDuration) => {
    return state.availableActivities.filter(activity => 
      activity.duration >= minDuration && activity.duration <= maxDuration
    );
  };
  
  // Get quick activities (under 60 minutes)
  const getQuickActivities = () => {
    return getActivitiesByDuration(0, 60);
  };
  
  // Get medium activities (60-120 minutes)
  const getMediumActivities = () => {
    return getActivitiesByDuration(60, 120);
  };
  
  // Get long activities (over 120 minutes)
  const getLongActivities = () => {
    return getActivitiesByDuration(120, Infinity);
  };
  
  // Get mood options
  const getMoods = () => {
    return state.moods;
  };
  
  // Get mood by ID
  const getMoodById = (id) => {
    return state.moods.find(mood => mood.id === id);
  };
  
  // Get status options
  const getStatuses = () => {
    return state.statuses;
  };
  
  // Get status by ID
  const getStatusById = (id) => {
    return state.statuses.find(status => status.id === id);
  };
  
  // Get activities grouped by category
  const getActivitiesGroupedByCategory = () => {
    const categories = getCategories();
    return categories.map(category => ({
      category,
      activities: getActivitiesByCategory(category)
    }));
  };
  
  // Get activity statistics
  const getActivityStats = () => {
    const activities = state.availableActivities;
    const categories = getCategories();
    
    return {
      total: activities.length,
      categories: categories.length,
      averageDuration: activities.reduce((sum, activity) => sum + activity.duration, 0) / activities.length,
      shortestDuration: Math.min(...activities.map(a => a.duration)),
      longestDuration: Math.max(...activities.map(a => a.duration)),
      categoryCounts: categories.map(category => ({
        category,
        count: getActivitiesByCategory(category).length
      }))
    };
  };
  
  return {
    // Activities
    availableActivities: state.availableActivities,
    getAvailableActivities,
    getActivityById,
    getActivitiesByCategory,
    getCategories,
    searchActivities,
    getActivitiesByDuration,
    getQuickActivities,
    getMediumActivities,
    getLongActivities,
    getActivitiesGroupedByCategory,
    getActivityStats,
    
    // Moods and Statuses
    moods: state.moods,
    statuses: state.statuses,
    getMoods,
    getMoodById,
    getStatuses,
    getStatusById
  };
}
