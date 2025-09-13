'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Brain, Users, Palette, Coffee } from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { useActivities } from '@/hooks';

const MoodSelector = ({ 
  selectedMood, 
  onMoodChange, 
  size = 'md',
  showLabels = true,
  className = '' 
}) => {
  const { getMoods } = useActivities();
  const moods = getMoods();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Icon mapping for moods
  const moodIcons = {
    happy: Heart,
    relaxed: Coffee,
    energetic: Zap,
    focused: Brain,
    creative: Palette,
    social: Users
  };
  
  // Color mapping for moods
  const moodColors = {
    happy: 'yellow',
    relaxed: 'green',
    energetic: 'orange',
    focused: 'blue',
    creative: 'purple',
    social: 'pink'
  };
  
  const selectedMoodData = moods.find(mood => mood.id === selectedMood);
  const SelectedIcon = selectedMoodData ? moodIcons[selectedMoodData.id] : Heart;
  const selectedColor = selectedMoodData ? moodColors[selectedMoodData.id] : 'gray';
  
  const handleMoodSelect = (moodId) => {
    onMoodChange(moodId);
    setIsExpanded(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Selected Mood Display */}
      <Button
        variant="outline"
        size={size}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-2 ${
          selectedMood ? `border-${selectedColor}-300 bg-${selectedColor}-50` : ''
        }`}
      >
        <SelectedIcon 
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} 
          className={`text-${selectedColor}-600`}
        />
        {showLabels && (
          <span className={selectedMood ? `text-${selectedColor}-700` : 'text-gray-600'}>
            {selectedMoodData?.name || 'Select Mood'}
          </span>
        )}
      </Button>
      
      {/* Mood Options Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-full left-0 mt-2 z-50"
          >
            <Card variant="elevated" className="p-3 min-w-[200px]">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Mood</h4>
                {moods.map((mood) => {
                  const IconComponent = moodIcons[mood.id];
                  const color = moodColors[mood.id];
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                        isSelected 
                          ? `bg-${color}-100 border-2 border-${color}-300` 
                          : 'hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? `bg-${color}-200` : 'bg-gray-100'
                      }`}>
                        <IconComponent 
                          size={16} 
                          className={isSelected ? `text-${color}-700` : 'text-gray-600'} 
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-sm ${
                          isSelected ? `text-${color}-800` : 'text-gray-700'
                        }`}>
                          {mood.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getMoodDescription(mood.id)}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-full bg-${color}-500`}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to get mood descriptions
const getMoodDescription = (moodId) => {
  const descriptions = {
    happy: 'Feeling joyful and positive',
    relaxed: 'Calm and peaceful vibes',
    energetic: 'High energy and active',
    focused: 'Concentrated and determined',
    creative: 'Inspired and artistic',
    social: 'Outgoing and friendly'
  };
  return descriptions[moodId] || '';
};

export default MoodSelector;
