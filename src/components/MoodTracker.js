'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Heart } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useWeekendSchedule } from '@/hooks';

const MoodTracker = ({ className = '' }) => {
  const { getAllActivities } = useWeekendSchedule();
  const [moodData, setMoodData] = useState(null);
  
  // Memoize activities to prevent infinite re-renders
  const allActivities = useMemo(() => getAllActivities(), [getAllActivities]);
  const allScheduledActivities = useMemo(() => [
    ...allActivities.saturday,
    ...allActivities.sunday
  ], [allActivities.saturday, allActivities.sunday]);
  
  // Calculate simplified mood statistics
  useEffect(() => {
    const calculateMoodStats = () => {
      
      // Group activities by mood
      const moodCounts = allScheduledActivities.reduce((acc, activity) => {
        if (activity.mood) {
          acc[activity.mood] = (acc[activity.mood] || 0) + 1;
        }
        return acc;
      }, {});
      
      // Calculate mood distribution
      const totalActivities = allScheduledActivities.length;
      const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0
      }));
      
      // Get most common mood
      const mostCommonMood = moodDistribution.reduce((max, current) => 
        current.count > max.count ? current : max, 
        { mood: 'happy', count: 0, percentage: 0 }
      );
      
      setMoodData({
        totalActivities,
        moodDistribution,
        mostCommonMood
      });
    };

    calculateMoodStats();
  }, [allScheduledActivities]);
  
  // Helper function to get most common mood
  const getMostCommonMood = (moods) => {
    if (moods.length === 0) return 'happy';
    
    const counts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts).reduce((max, current) => 
      current[1] > max[1] ? current : max, 
      ['happy', 0]
    )[0];
  };
  
  // Get mood color
  const getMoodColor = (mood) => {
    const colors = {
      happy: 'yellow',
      relaxed: 'green',
      energetic: 'orange',
      focused: 'blue',
      creative: 'purple',
      social: 'pink'
    };
    return colors[mood] || 'gray';
  };
  
  // Get mood icon
  const getMoodIcon = (mood) => {
    const icons = {
      happy: '😊',
      relaxed: '😌',
      energetic: '⚡',
      focused: '🎯',
      creative: '🎨',
      social: '👥'
    };
    return icons[mood] || '😊';
  };
  
  if (!moodData) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-coral-500" />
          <span>Mood Insights</span>
        </h3>
      </div>
      
      {/* Simplified Mood Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">
            {moodData.totalActivities}
          </div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-coral-600">
            {getMoodIcon(moodData.mostCommonMood.mood)}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {moodData.mostCommonMood.mood} ({moodData.mostCommonMood.percentage}%)
          </div>
        </div>
      </div>
      
      {/* Simplified Mood Distribution */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 flex items-center space-x-2">
          <BarChart3 size={16} />
          <span>Mood Breakdown</span>
        </h4>
        
        <div className="space-y-2">
          {moodData.moodDistribution.slice(0, 4).map((mood) => {
            const color = getMoodColor(mood.mood);
            const icon = getMoodIcon(mood.mood);
            
            return (
              <motion.div
                key={mood.mood}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: mood.percentage * 0.01 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {mood.mood}
                    </span>
                    <span className="text-sm text-gray-500">
                      {mood.count} ({mood.percentage}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mood.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`h-2 rounded-full bg-${color}-500`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default MoodTracker;
