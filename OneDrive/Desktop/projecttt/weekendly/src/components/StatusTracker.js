'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Target } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useWeekendSchedule } from '@/hooks';

const StatusTracker = ({ className = '' }) => {
  const { getAllActivities } = useWeekendSchedule();
  const [statusData, setStatusData] = useState(null);
  
  const allActivities = getAllActivities();
  
  useEffect(() => {
    const calculateStatusStats = () => {
      const allScheduledActivities = [
        ...allActivities.saturday,
        ...allActivities.sunday
      ];
      
      // Group activities by status
      const statusCounts = allScheduledActivities.reduce((acc, activity) => {
        acc[activity.status] = (acc[activity.status] || 0) + 1;
        return acc;
      }, {});
      
      const totalActivities = allScheduledActivities.length;
      
      // Calculate status distribution
      const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: totalActivities > 0 ? Math.round((count / totalActivities) * 100) : 0
      }));
      
      // Calculate completion rate
      const completedActivities = statusCounts.done || 0;
      const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
      
      // Calculate progress rate (in progress + done)
      const inProgressActivities = statusCounts.inProgress || 0;
      const progressRate = totalActivities > 0 ? Math.round(((inProgressActivities + completedActivities) / totalActivities) * 100) : 0;
      
      setStatusData({
        totalActivities,
        statusDistribution,
        completionRate,
        progressRate
      });
    };

    calculateStatusStats();
  }, [allActivities.saturday, allActivities.sunday]);
  
  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'gray',
      inProgress: 'blue',
      done: 'green',
      cancelled: 'red'
    };
    return colors[status] || 'gray';
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      inProgress: '▶️',
      done: '✅',
      cancelled: '❌'
    };
    return icons[status] || '⏳';
  };
  
  if (!statusData) {
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
          <Target className="w-5 h-5 text-coral-500" />
          <span>Progress Tracker</span>
        </h3>
      </div>
      
      {/* Simplified Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-800">
            {statusData.totalActivities}
          </div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {statusData.completionRate}%
          </div>
          <div className="text-sm text-gray-600">Completion Rate</div>
        </div>
      </div>
      
      {/* Simplified Status Distribution */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 flex items-center space-x-2">
          <BarChart3 size={16} />
          <span>Status Breakdown</span>
        </h4>
        
        <div className="space-y-2">
          {statusData.statusDistribution.slice(0, 3).map((status) => {
            const color = getStatusColor(status.status);
            const icon = getStatusIcon(status.status);
            
            return (
              <motion.div
                key={status.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: status.percentage * 0.01 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status.status.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {status.count} ({status.percentage}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${status.percentage}%` }}
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
      
      {/* Progress Feedback */}
      {statusData.completionRate > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <TrendingUp size={16} />
            <span>
              {statusData.completionRate === 100 
                ? "🎉 All activities completed! Great job!"
                : statusData.completionRate > 75
                ? "🔥 You're making excellent progress!"
                : statusData.completionRate > 50
                ? "👍 Good progress, keep it up!"
                : "💪 You've got this! Keep going!"
              }
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatusTracker;
