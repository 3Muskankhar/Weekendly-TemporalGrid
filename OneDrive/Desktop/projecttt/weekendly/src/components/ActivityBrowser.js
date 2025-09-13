'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui';
import { useActivities, useWeekendSchedule } from '@/hooks';
import ActivityCard from './ActivityCard';
import DraggableActivityCard from './DraggableActivityCard';
import SearchAndFilter from './SearchAndFilter';
import DaySelector from './DaySelector';
import TipsModal from './TipsModal';

const ActivityBrowser = () => {
  const {
    availableActivities,
    getCategories,
    searchActivities
  } = useActivities();
  
  const { 
    addActivitySmart, 
    addActivity,
    selectedDay, 
    setSelectedDay,
    getDayActivities,
    getScheduleStats
  } = useWeekendSchedule();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Get schedule stats for day selector
  const scheduleStats = getScheduleStats();
  
  // Filter activities based on search and filters
  const filteredActivities = useMemo(() => {
    let activities = availableActivities;
    
    // Apply search filter
    if (searchQuery.trim()) {
      activities = searchActivities(searchQuery);
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      activities = activities.filter(activity => activity.category === selectedCategory);
    }
    
    // Apply duration filter
    if (selectedDuration !== 'all') {
      switch (selectedDuration) {
        case 'quick':
          activities = activities.filter(activity => activity.duration <= 60);
          break;
        case 'medium':
          activities = activities.filter(activity => activity.duration > 60 && activity.duration <= 120);
          break;
        case 'long':
          activities = activities.filter(activity => activity.duration > 120);
          break;
      }
    }
    
    return activities;
  }, [availableActivities, searchQuery, selectedCategory, selectedDuration, searchActivities]);
  
  // Handle adding activity to schedule
  const handleAddActivity = (activity, preferredTime) => {
    const success = preferredTime
      ? (addActivity(activity, selectedDay, preferredTime), true)
      : addActivitySmart(activity, selectedDay);
    if (success) {
      // Show success feedback
      console.log(`Added ${activity.name} to ${selectedDay}${preferredTime ? ' at ' + preferredTime : ''}`);
    } else {
      // Show error feedback
      console.log(`Could not add ${activity.name} - no available time slots`);
    }
  };

  // Handle showing tips for activity
  const handleShowTips = (activity) => {
    setSelectedActivity(activity);
    setShowTipsModal(true);
  };

  // New Activity quick-add
  const handleCreateCustom = async () => {
    const name = prompt('Activity name?');
    if (!name) return;
    const durationStr = prompt('Duration in minutes? (e.g., 60)');
    const duration = parseInt(durationStr || '60', 10) || 60;
    const category = prompt('Category? (food, outdoor, entertainment, relaxation, social, creative, errands)', 'social') || 'social';
    const time = prompt('Start time HH:MM (24h) or leave blank for auto-fit', '') || null;
    const activity = {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      icon: 'pending',
      category,
      duration,
      description: ''
    };
    if (time) {
      addActivity(activity, selectedDay, time);
    } else {
      addActivitySmart(activity, selectedDay);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Activities</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDuration={selectedDuration}
          onDurationChange={setSelectedDuration}
          categories={getCategories()}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        
        {/* Day Selector */}
        <div className="mt-4">
          <DaySelector
            selectedDay={selectedDay}
            onDayChange={setSelectedDay}
            saturdayCount={scheduleStats.saturday.count}
            sundayCount={scheduleStats.sunday.count}
          />
        </div>
      </div>
      
      {/* Activities List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-3'}>
            <AnimatePresence>
              {viewMode === 'grid' && (
                <motion.div
                  key="new-activity-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="h-full">
                    <div onClick={handleCreateCustom} className="cursor-pointer border-2 border-dashed border-coral-300 rounded-xl p-6 flex items-center justify-center text-coral-600 hover:bg-coral-50/40 transition-colors">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-coral-100 flex items-center justify-center mx-auto mb-3 text-coral-600 text-2xl">+</div>
                        <div className="font-medium">New Activity</div>
                        <div className="text-xs text-gray-500">Click to add your own</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DraggableActivityCard
                    activity={activity}
                    onAdd={handleAddActivity}
                    onShowTips={handleShowTips}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Footer Stats */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredActivities.length} of {availableActivities.length} activities
          </span>
          <span>
            Adding to {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
          </span>
        </div>
      </div>

      {/* Tips Modal */}
      <TipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        activity={selectedActivity}
      />
    </div>
  );
};

export default ActivityBrowser;
