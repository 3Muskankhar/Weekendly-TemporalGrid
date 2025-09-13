'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { schedulePersistence, preferencesPersistence } from '@/utils/persistence';

// Initial state
const initialState = {
  // Available activities to choose from
  availableActivities: [
    {
      id: 'brunch',
      name: 'Brunch',
      icon: 'Utensils',
      category: 'food',
      duration: 120,
      description: 'Enjoy a leisurely brunch with friends or family',
      needsLocation: true
    },
    {
      id: 'hiking',
      name: 'Hiking',
      icon: 'Hiking',
      category: 'outdoor',
      duration: 180,
      description: 'Explore nature trails and get some fresh air',
      needsLocation: true
    },
    {
      id: 'movie',
      name: 'Movie Night',
      icon: 'Film',
      category: 'entertainment',
      duration: 150,
      description: 'Watch a great film at home or theater',
      needsLocation: true
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: 'Book',
      category: 'relaxation',
      duration: 90,
      description: 'Dive into a good book and unwind',
      needsLocation: false
    },
    {
      id: 'coffee',
      name: 'Coffee Date',
      icon: 'Coffee',
      category: 'social',
      duration: 60,
      description: 'Catch up over coffee with someone special',
      needsLocation: true
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: 'Gamepad2',
      category: 'entertainment',
      duration: 120,
      description: 'Play your favorite video games',
      needsLocation: false
    },
    {
      id: 'music',
      name: 'Music Session',
      icon: 'Music',
      category: 'creative',
      duration: 90,
      description: 'Listen to music or play an instrument',
      needsLocation: false
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: 'Camera',
      category: 'creative',
      duration: 120,
      description: 'Capture beautiful moments with your camera',
      needsLocation: true
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: 'ShoppingBag',
      category: 'errands',
      duration: 150,
      description: 'Browse stores and find something special',
      needsLocation: true
    },
    {
      id: 'yoga',
      name: 'Yoga or Meditation',
      icon: 'Activity',
      category: 'relaxation',
      duration: 60,
      description: 'Mindful stretch and calm',
      needsLocation: false
    },
    {
      id: 'cooking',
      name: 'Cooking a New Recipe',
      icon: 'ChefHat',
      category: 'food',
      duration: 90,
      description: 'Try something new in the kitchen',
      needsLocation: false
    },
    {
      id: 'picnic',
      name: 'Picnic in the Park',
      icon: 'Sun',
      category: 'outdoor',
      duration: 120,
      description: 'Pack snacks and relax',
      needsLocation: true
    },
    {
      id: 'cycling',
      name: 'Cycling',
      icon: 'Bike',
      category: 'outdoor',
      duration: 90,
      description: 'Ride around your city',
      needsLocation: true
    },
    {
      id: 'painting',
      name: 'Painting or Drawing',
      icon: 'Palette',
      category: 'creative',
      duration: 120,
      description: 'Express yourself on canvas',
      needsLocation: false
    },
    {
      id: 'explore_cafe',
      name: 'Explore a New Café/Restaurant',
      icon: 'Utensils',
      category: 'food',
      duration: 90,
      description: 'Try a new spot nearby',
      needsLocation: true
    },
    {
      id: 'museum',
      name: 'Visit a Museum / Art Gallery',
      icon: 'Building',
      category: 'entertainment',
      duration: 120,
      description: 'Culture and inspiration',
      needsLocation: true
    },
    {
      id: 'gardening',
      name: 'Gardening',
      icon: 'Flower',
      category: 'relaxation',
      duration: 90,
      description: 'Hands in the soil',
      needsLocation: false
    },
    {
      id: 'local_event',
      name: 'Local Event / Concert',
      icon: 'Music',
      category: 'entertainment',
      duration: 120,
      description: 'Find something happening nearby',
      needsLocation: true
    },
    {
      id: 'road_trip',
      name: 'Road Trip / Short Drive',
      icon: 'Car',
      category: 'outdoor',
      duration: 180,
      description: 'Explore the surroundings',
      needsLocation: true
    },
    {
      id: 'family_board_game',
      name: 'Family Board Game Night',
      icon: 'Gamepad2',
      category: 'social',
      duration: 120,
      description: 'Fun games with family',
      needsLocation: false
    },
    {
      id: 'exercise',
      name: 'Exercise / Workout',
      icon: 'Dumbbell',
      category: 'relaxation',
      duration: 60,
      description: 'Get your body moving and stay fit',
      needsLocation: false
    },
    {
      id: 'meditation',
      name: 'Meditation',
      icon: 'Zap',
      category: 'relaxation',
      duration: 30,
      description: 'Find inner peace and mindfulness',
      needsLocation: false
    }
  ],
  
  // User's weekend schedule
  weekendSchedule: {
    saturday: [],
    sunday: []
  },
  
  // Mood options
  moods: [
    { id: 'happy', name: 'Happy', icon: 'happy', color: 'yellow' },
    { id: 'relaxed', name: 'Relaxed', icon: 'relaxed', color: 'green' },
    { id: 'energetic', name: 'Energetic', icon: 'energetic', color: 'orange' },
    { id: 'focused', name: 'Focused', icon: 'focused', color: 'blue' },
    { id: 'creative', name: 'Creative', icon: 'creative', color: 'purple' },
    { id: 'social', name: 'Social', icon: 'social', color: 'pink' }
  ],
  
  // Status options
  statuses: [
    { id: 'pending', name: 'Pending', icon: 'pending', color: 'gray' },
    { id: 'inProgress', name: 'In Progress', icon: 'inProgress', color: 'blue' },
    { id: 'done', name: 'Done', icon: 'done', color: 'green' },
    { id: 'cancelled', name: 'Cancelled', icon: 'cancelled', color: 'red' }
  ],
  
  // UI state
  ui: {
    selectedDay: 'saturday',
    isModalOpen: false,
    editingActivity: null,
    draggedActivity: null
  },
  
  // User preferences
  preferences: {
    theme: 'light',
    defaultMood: 'happy',
    defaultStatus: 'pending',
    showTimeSlots: true,
    viewMode: 'grid',
    notifications: true,
    autoSave: true
  }
};

// Action types
export const ACTIONS = {
  // Schedule actions
  ADD_ACTIVITY: 'ADD_ACTIVITY',
  REMOVE_ACTIVITY: 'REMOVE_ACTIVITY',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  MOVE_ACTIVITY: 'MOVE_ACTIVITY',
  REORDER_ACTIVITIES: 'REORDER_ACTIVITIES',
  
  // UI actions
  SET_SELECTED_DAY: 'SET_SELECTED_DAY',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SET_EDITING_ACTIVITY: 'SET_EDITING_ACTIVITY',
  SET_DRAGGED_ACTIVITY: 'SET_DRAGGED_ACTIVITY',
  
  // Persistence actions
  LOAD_SCHEDULE: 'LOAD_SCHEDULE',
  SAVE_SCHEDULE: 'SAVE_SCHEDULE',
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
  SAVE_PREFERENCES: 'SAVE_PREFERENCES'
};

// Reducer function
function weekendReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ACTIVITY: {
      const { activity, day, time, mood, status } = action.payload;
      const newActivity = {
        id: `${activity.id}-${Date.now()}`,
        activityId: activity.id,
        name: activity.name,
        icon: activity.icon,
        category: activity.category,
        duration: activity.duration,
        description: activity.description,
        time: time || '09:00',
        mood: mood || 'happy',
        status: status || 'pending',
        day
      };
      
      return {
        ...state,
        weekendSchedule: {
          ...state.weekendSchedule,
          [day]: [...state.weekendSchedule[day], newActivity]
        }
      };
    }
    
    case ACTIONS.REMOVE_ACTIVITY: {
      const { activityId, day } = action.payload;
      return {
        ...state,
        weekendSchedule: {
          ...state.weekendSchedule,
          [day]: state.weekendSchedule[day].filter(activity => activity.id !== activityId)
        }
      };
    }
    
    case ACTIONS.UPDATE_ACTIVITY: {
      const { activityId, day, updates } = action.payload;
      return {
        ...state,
        weekendSchedule: {
          ...state.weekendSchedule,
          [day]: state.weekendSchedule[day].map(activity =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          )
        }
      };
    }
    
    case ACTIONS.MOVE_ACTIVITY: {
      const { activityId, fromDay, toDay, newTime } = action.payload;
      const activity = state.weekendSchedule[fromDay].find(a => a.id === activityId);
      
      if (!activity) return state;
      
      const updatedActivity = {
        ...activity,
        day: toDay,
        time: newTime || activity.time
      };
      
      return {
        ...state,
        weekendSchedule: {
          ...state.weekendSchedule,
          [fromDay]: state.weekendSchedule[fromDay].filter(a => a.id !== activityId),
          [toDay]: [...state.weekendSchedule[toDay], updatedActivity]
        }
      };
    }
    
    case ACTIONS.REORDER_ACTIVITIES: {
      const { day, newOrder } = action.payload;
      return {
        ...state,
        weekendSchedule: {
          ...state.weekendSchedule,
          [day]: newOrder
        }
      };
    }
    
    case ACTIONS.SET_SELECTED_DAY:
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedDay: action.payload
        }
      };
    
    case ACTIONS.OPEN_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          isModalOpen: true
        }
      };
    
    case ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        ui: {
          ...state.ui,
          isModalOpen: false,
          editingActivity: null
        }
      };
    
    case ACTIONS.SET_EDITING_ACTIVITY:
      return {
        ...state,
        ui: {
          ...state.ui,
          editingActivity: action.payload
        }
      };
    
    case ACTIONS.SET_DRAGGED_ACTIVITY:
      return {
        ...state,
        ui: {
          ...state.ui,
          draggedActivity: action.payload
        }
      };
    
    case ACTIONS.LOAD_SCHEDULE:
      return {
        ...state,
        weekendSchedule: action.payload || initialState.weekendSchedule
      };
    
    case ACTIONS.LOAD_PREFERENCES:
      return {
        ...state,
        preferences: action.payload || initialState.preferences
      };
    
    case ACTIONS.SAVE_PREFERENCES:
      return {
        ...state,
        preferences: action.payload
      };
    
    default:
      return state;
  }
}

// Context
const WeekendContext = createContext();

// Provider component
export function WeekendProvider({ children }) {
  const [state, dispatch] = useReducer(weekendReducer, initialState);
  
  // Load schedule and preferences from localStorage on mount
  useEffect(() => {
    const savedSchedule = schedulePersistence.loadSchedule();
    const savedPreferences = preferencesPersistence.loadPreferences();
    
    dispatch({ type: ACTIONS.LOAD_SCHEDULE, payload: savedSchedule });
    dispatch({ type: ACTIONS.LOAD_PREFERENCES, payload: savedPreferences });
  }, []);
  
  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    schedulePersistence.saveSchedule(state.weekendSchedule);
  }, [state.weekendSchedule]);
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (state.preferences) {
      preferencesPersistence.savePreferences(state.preferences);
    }
  }, [state.preferences]);
  
  // Action creators
  const actions = {
    addActivity: (activity, day, time, mood, status) => {
      dispatch({
        type: ACTIONS.ADD_ACTIVITY,
        payload: { activity, day, time, mood, status }
      });
    },
    
    removeActivity: (activityId, day) => {
      dispatch({
        type: ACTIONS.REMOVE_ACTIVITY,
        payload: { activityId, day }
      });
    },
    
    updateActivity: (activityId, day, updates) => {
      dispatch({
        type: ACTIONS.UPDATE_ACTIVITY,
        payload: { activityId, day, updates }
      });
    },
    
    moveActivity: (activityId, fromDay, toDay, newTime) => {
      dispatch({
        type: ACTIONS.MOVE_ACTIVITY,
        payload: { activityId, fromDay, toDay, newTime }
      });
    },
    
    reorderActivities: (day, newOrder) => {
      dispatch({
        type: ACTIONS.REORDER_ACTIVITIES,
        payload: { day, newOrder }
      });
    },
    
    setSelectedDay: (day) => {
      dispatch({
        type: ACTIONS.SET_SELECTED_DAY,
        payload: day
      });
    },
    
    openModal: () => {
      dispatch({ type: ACTIONS.OPEN_MODAL });
    },
    
    closeModal: () => {
      dispatch({ type: ACTIONS.CLOSE_MODAL });
    },
    
    setEditingActivity: (activity) => {
      dispatch({
        type: ACTIONS.SET_EDITING_ACTIVITY,
        payload: activity
      });
    },
    
    setDraggedActivity: (activity) => {
      dispatch({
        type: ACTIONS.SET_DRAGGED_ACTIVITY,
        payload: activity
      });
    }
  };
  
  return (
    <WeekendContext.Provider value={{ state, actions }}>
      {children}
    </WeekendContext.Provider>
  );
}

// Custom hook to use the context
export function useWeekend() {
  const context = useContext(WeekendContext);
  if (!context) {
    throw new Error('useWeekend must be used within a WeekendProvider');
  }
  return context;
}

export default WeekendContext;
