'use client';

import { motion } from 'framer-motion';
import { Plus, Clock, MoreHorizontal, MapPin, Info, Lightbulb } from 'lucide-react';
import { Card, Badge, Button, Icon } from '@/components/ui';
import { getActivityIcon, getActivityIconWithAI, needsLocation } from '@/utils/iconUtils';
import { useState, useEffect } from 'react';

const ActivityCard = ({ 
  activity, 
  onAdd, 
  onEdit, 
  onShowTips,
  viewMode = 'grid',
  showAddButton = true,
  className = '' 
}) => {
  const [iconName, setIconName] = useState(activity.icon || getActivityIcon(activity));

  // Load AI-generated icon on mount
  useEffect(() => {
    const loadAIIcon = async () => {
      try {
        const aiIcon = await getActivityIconWithAI(activity);
        setIconName(aiIcon);
      } catch (error) {
        console.warn('Failed to load AI icon:', error);
        // Keep the fallback icon
      }
    };

    // Only try AI icon if we don't have a good fallback
    if (!activity.icon || activity.icon === 'pending') {
      loadAIIcon();
    }
  }, [activity]);

  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      food: 'coral',
      outdoor: 'green',
      entertainment: 'purple',
      relaxation: 'blue',
      social: 'pink',
      creative: 'orange',
      errands: 'gray'
    };
    return colors[category] || 'gray';
  };
  
  const handleAdd = (e) => {
    e.stopPropagation();
    // Prompt for time (HH:MM 24h) and pass back
    let input = prompt('Add at what time? (HH:MM, e.g., 09:00, 14:30)');
    if (!input) return;
    input = input.trim();
    const valid = /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(input);
    if (!valid) {
      alert('Please enter a valid time in HH:MM 24-hour format.');
      return;
    }
    onAdd?.(activity, input);
  };
  
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(activity);
  };
  
  const handleFindNearby = (e) => {
    e.stopPropagation();
    const defaultQuery = `${activity.name}`;
    const query = prompt('Find nearby (e.g., coffee, dinner, hiking trail):', defaultQuery) || defaultQuery;
    window.dispatchEvent(new CustomEvent('places:findNearby', { 
      detail: { 
        query,
        activity // Pass the activity context for smart search
      } 
    }));
  };

  const handleShowTips = (e) => {
    e.stopPropagation();
    onShowTips?.(activity);
  };

  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        variant="default"
        hover
        className={`group cursor-pointer transition-all duration-200 ${
          viewMode === 'list' ? 'p-4' : 'p-6'
        } ${className}`}
        onClick={handleAdd}
      >
        <div className={`flex ${viewMode === 'list' ? 'items-center space-x-4' : 'flex-col items-center text-center'}`}>
          {/* Icon */}
          <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
            <div className={`w-12 h-12 bg-${getCategoryColor(activity.category)}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Icon 
                name={iconName} 
                size={24} 
                color={`${getCategoryColor(activity.category)}-600`}
                animate
              />
            </div>
          </div>
          
          {/* Content */}
          <div className={`flex-1 ${viewMode === 'list' ? 'min-w-0' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 truncate group-hover:text-coral-600 transition-colors">
                {activity.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge variant="default" size="sm" className="bg-gray-100 text-gray-700">
                  {formatDuration(activity.duration)}
                </Badge>
                {showAddButton && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus 
                      className="w-4 h-4 text-gray-400 group-hover:text-coral-500 transition-colors" 
                    />
                  </motion.div>
                )}
                {needsLocation(activity) ? (
                  <button
                    onClick={handleFindNearby}
                    className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-coral-600"
                    title="Find nearby places"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleShowTips}
                    className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-coral-600"
                    title="Get tips and guidance"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
              {activity.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="primary" 
                size="sm"
                className={`bg-${getCategoryColor(activity.category)}-100 text-${getCategoryColor(activity.category)}-800 hover:bg-${getCategoryColor(activity.category)}-200 transition-colors`}
              >
                {activity.category}
              </Badge>
              
              {viewMode === 'list' && (
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {formatDuration(activity.duration)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="w-8 h-8 p-0"
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;
