'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw } from 'lucide-react';
import { Button, Modal, Input, Select } from '@/components/ui';
import { useActivities } from '@/hooks';

const ActivityMoodEditor = ({ 
  isOpen, 
  onClose, 
  activity, 
  onSave 
}) => {
  const { getMoods, getStatuses } = useActivities();
  const [editedActivity, setEditedActivity] = useState(activity);
  const [isSaving, setIsSaving] = useState(false);
  
  const moods = getMoods();
  const statuses = getStatuses();
  
  // Update local state when activity prop changes
  useState(() => {
    if (activity) {
      setEditedActivity(activity);
    }
  }, [activity]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedActivity);
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleReset = () => {
    setEditedActivity(activity);
  };
  
  const handleChange = (field, value) => {
    setEditedActivity(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const hasChanges = JSON.stringify(editedActivity) !== JSON.stringify(activity);
  
  if (!activity) return null;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Activity"
      size="md"
    >
      <div className="space-y-6">
        {/* Activity Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center">
            <span className="text-coral-600 font-semibold text-lg">
              {activity.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{activity.name}</h3>
            <p className="text-sm text-gray-600">{activity.category}</p>
          </div>
        </div>
        
        {/* Time and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Time"
            type="time"
            value={editedActivity.time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={editedActivity.duration}
            onChange={(e) => handleChange('duration', parseInt(e.target.value))}
            min="15"
            max="480"
            step="15"
          />
        </div>
        
        {/* Mood Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood
          </label>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => {
              const isSelected = editedActivity.mood === mood.id;
              const color = getMoodColor(mood.id);
              
              return (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChange('mood', mood.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? `border-${color}-300 bg-${color}-100` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {getMoodIcon(mood.id)}
                    </div>
                    <div className={`text-xs font-medium ${
                      isSelected ? `text-${color}-800` : 'text-gray-600'
                    }`}>
                      {mood.name}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((status) => {
              const isSelected = editedActivity.status === status.id;
              const color = getStatusColor(status.id);
              
              return (
                <motion.button
                  key={status.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChange('status', status.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? `border-${color}-300 bg-${color}-100` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                    <span className={`text-sm font-medium ${
                      isSelected ? `text-${color}-800` : 'text-gray-600'
                    }`}>
                      {status.name}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={editedActivity.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            rows="3"
            placeholder="Add a description for this activity..."
          />
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!hasChanges}
            className="flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Helper functions
const getMoodColor = (moodId) => {
  const colors = {
    happy: 'yellow',
    relaxed: 'green',
    energetic: 'orange',
    focused: 'blue',
    creative: 'purple',
    social: 'pink'
  };
  return colors[moodId] || 'gray';
};

const getMoodIcon = (moodId) => {
  const icons = {
    happy: '😊',
    relaxed: '😌',
    energetic: '⚡',
    focused: '🎯',
    creative: '🎨',
    social: '👥'
  };
  return icons[moodId] || '😊';
};

const getStatusColor = (statusId) => {
  const colors = {
    pending: 'gray',
    inProgress: 'blue',
    done: 'green',
    cancelled: 'red'
  };
  return colors[statusId] || 'gray';
};

export default ActivityMoodEditor;
