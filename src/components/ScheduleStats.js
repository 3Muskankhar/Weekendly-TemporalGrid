'use client';

import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui';

const ScheduleStats = ({ 
  dayStats, 
  timeConflicts = [], 
  totalDuration = 0,
  activityCount = 0 
}) => {
  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (activityCount === 0) return 0;
    const completedActivities = dayStats?.activities?.filter(a => a.status === 'done').length || 0;
    return Math.round((completedActivities / activityCount) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Main Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={14} />
            <span>Total: {formatDuration(totalDuration)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{activityCount} activit{activityCount !== 1 ? 'ies' : 'y'}</span>
          </div>
        </div>
        
        {/* Completion Badge */}
        {activityCount > 0 && (
          <Badge
            variant={completionPercentage === 100 ? 'success' : 'default'}
            size="sm"
            className="flex items-center space-x-1"
          >
            <CheckCircle size={12} />
            <span>{completionPercentage}% done</span>
          </Badge>
        )}
      </div>
      
      {/* Conflicts Warning */}
      {timeConflicts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
        >
          <AlertTriangle size={14} />
          <span>
            {timeConflicts.length} time conflict{timeConflicts.length > 1 ? 's' : ''} detected
          </span>
        </motion.div>
      )}
      
      {/* Progress Bar */}
      {activityCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-2 rounded-full ${
                completionPercentage === 100 
                  ? 'bg-green-500' 
                  : completionPercentage > 50 
                    ? 'bg-blue-500' 
                    : 'bg-coral-500'
              }`}
            />
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      {dayStats && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-800">
              {dayStats.activities?.filter(a => a.status === 'pending').length || 0}
            </div>
            <div className="text-gray-500">Pending</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-800">
              {dayStats.activities?.filter(a => a.status === 'inProgress').length || 0}
            </div>
            <div className="text-gray-500">Active</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-800">
              {dayStats.activities?.filter(a => a.status === 'done').length || 0}
            </div>
            <div className="text-gray-500">Done</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScheduleStats;
