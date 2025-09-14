'use client';
import { DndContext, DragOverlay, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useState, useEffect, Suspense } from 'react';
import dynamic from "next/dynamic";
import { motion } from 'framer-motion';
import { Settings, BarChart3, Clock, Calendar, Share2, Download } from 'lucide-react';
import { Button, CelebrationEffect } from '@/components/ui';
import { 
  WeekendSchedule, 
  MoodTracker, 
  StatusTracker,
  ResponsiveLayout,
  MobileTouchOptimizer,
  NearbyPanel
} from '@/components';
import { useWeekendSchedule, useActivities } from '@/hooks';
import { useSearchParams } from 'next/navigation';

const ActivityBrowser = dynamic(() => import("@/components/ActivityBrowser"), {
  ssr: false,
});

// Time Selection Modal Component
const TimeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  activity,
  selectedDay = 'saturday',
  suggestedTime = '09:00'
}) => {
  const [selectedTime, setSelectedTime] = useState(suggestedTime);
  const [duration, setDuration] = useState(activity?.defaultDuration || 60);

  if (!isOpen) return null;

  // Generate time options (6 AM to 11 PM, 30-minute intervals)
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleConfirm = () => {
    onConfirm({
      ...activity,
      time: selectedTime,
      duration,
      day: selectedDay
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-4 md:p-6 w-full max-w-sm md:max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="text-coral-600" size={24} />
          <h3 className="text-xl font-semibold">Schedule Activity</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity: <span className="font-semibold text-coral-600">{activity?.name}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day: <span className="font-semibold">{selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Start Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {formatTime(time)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              min="15"
              max="480"
              step="15"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors"
          >
            Schedule Activity
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Drag Overlay Component
const DragOverlayCard = ({ activity }) => {
  if (!activity) return null;

  return (
    <motion.div
      initial={{ scale: 1.05, rotate: 5 }}
      animate={{ scale: 1.1, rotate: 8 }}
      className="bg-white rounded-xl p-4 shadow-2xl border-2 border-coral-400 min-w-[200px] transform"
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center">
          <span className="text-2xl">{activity.icon || '🎯'}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{activity.name}</h3>
          <p className="text-sm text-gray-600">{activity.category}</p>
        </div>
      </div>
    </motion.div>
  );
};

const PlannerPageContent = () => {
  const { getScheduleStats, addActivity, updateActivity, selectedDay, clearWeekend, getDayActivities } = useWeekendSchedule();
  const searchParams = useSearchParams();
  const [weekendDatesState, setWeekendDatesState] = useState({ start: '', end: '' });

  // Apply predefined plan activities
  const applyPredefinedPlan = (plan) => {
    if (!plan || !plan.activities) return;
    
    // Clear existing activities first to avoid overlap
    clearWeekend();
    
    plan.activities.forEach(activity => {
      // Determine which day to add the activity (default to saturday)
      const day = activity.day || 'saturday';
      
      // Create activity object with proper structure
      const activityObj = {
        id: `predefined_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: activity.name,
        category: activity.category,
        duration: activity.duration,
        description: activity.description || `Pre-planned ${activity.name.toLowerCase()} activity`,
        mood: activity.mood,
        status: 'pending',
        time: activity.time,
        isPredefined: true
      };
      
      // Add to schedule
      addActivity(activityObj, day, activity.time);
    });
  };

  // Resolve weekend dates after mount to avoid hydration mismatch
  useEffect(() => {
    const spStart = searchParams.get('start');
    const spEnd = searchParams.get('end');
    const planParam = searchParams.get('plan');
    let start = spStart || '';
    let end = spEnd || '';
    try {
      const saved = localStorage.getItem('weekendly:weekendDates');
      if (!start || !end) {
        const parsed = saved ? JSON.parse(saved) : null;
        start = start || parsed?.start || '';
        end = end || parsed?.end || '';
      }
      if (start && end) {
        localStorage.setItem('weekendly:weekendDates', JSON.stringify({ start, end }));
      }
    } catch {}
    setWeekendDatesState({ start, end });

    // Handle predefined plan
    if (planParam && typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('weekendly:predefinedPlan');
      if (storedPlan) {
        try {
          const plan = JSON.parse(storedPlan);
          // Apply predefined plan activities
          if (plan && plan.activities) {
            // Clear existing activities first to avoid overlap
            clearWeekend();
            
            plan.activities.forEach(activity => {
              // Determine which day to add the activity (default to saturday)
              const day = activity.day || 'saturday';
              
              // Create activity object with proper structure
              const activityObj = {
                id: `predefined_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: activity.name,
                category: activity.category,
                duration: activity.duration,
                description: activity.description || `Pre-planned ${activity.name.toLowerCase()} activity`,
                mood: activity.mood,
                status: 'pending',
                time: activity.time,
                isPredefined: true
              };
              
              // Add to schedule
              addActivity(activityObj, day, activity.time);
            });
          }
          // Clear the stored plan after applying
          localStorage.removeItem('weekendly:predefinedPlan');
        } catch (e) {
          console.error('Failed to parse stored predefined plan:', e);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Dependencies intentionally omitted to prevent infinite re-renders

  const { activities } = useActivities();
  
  // State management
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [pendingDropData, setPendingDropData] = useState(null);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [vibeTarget, setVibeTarget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPlaces, setShowPlaces] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Drag and drop state
  const [activeId, setActiveId] = useState(null);
  const [draggedActivity, setDraggedActivity] = useState(null);
  
  const scheduleStats = getScheduleStats();

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context: { active, droppableContainers } }) => {
        // Custom keyboard navigation logic if needed
        return { x: 0, y: 0 };
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    console.log('Drag started:', active);
    
    setActiveId(active.id);
    
    // Extract activity data from the dragged item
    const dragData = active.data.current;
    if (dragData?.activity) {
      setDraggedActivity(dragData.activity);
      console.log('Dragged activity:', dragData.activity);
    }
  };

  // Handle drag over (optional - for visual feedback)
  const handleDragOver = (event) => {
    const { active, over } = event;
    // You can use this for additional visual feedback
    console.log('Drag over:', { active: active?.id, over: over?.id });
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    console.log('Drag ended:', { 
      activeId: active?.id, 
      overId: over?.id,
      activeData: active?.data.current,
      overData: over?.data.current
    });

    // Reset drag state
    setActiveId(null);
    setDraggedActivity(null);
    
    if (!over) {
      console.log('No drop target');
      return;
    }

    const draggedData = active.data.current;
    const dropData = over.data.current;

    if (!draggedData || !dropData) {
      console.log('Missing drag or drop data');
      return;
    }

    // Handle different drop scenarios
    if (draggedData.type === 'activity') {
      handleActivityDrop(draggedData, dropData);
    } else if (draggedData.type === 'scheduled-activity') {
      handleScheduledActivityMove(draggedData, dropData);
    }
  };

  // Handle dropping new activity
  const handleActivityDrop = (draggedData, dropData) => {
    const activity = draggedData.activity;
    
    console.log('Activity drop:', { activity, dropData });

    if (dropData.type === 'timeline') {
      // Dropped on day timeline - show time selection modal
      setPendingActivity(activity);
      setPendingDropData({ ...dropData, suggestedTime: '09:00' });
      setShowTimeModal(true);
    } else if (dropData.type === 'timeslot') {
      // Dropped on specific time slot - add directly at that time
      try {
        addActivity(activity, dropData.day, dropData.time);
        console.log('Activity added to time slot:', { activity, time: dropData.time, day: dropData.day });
      } catch (error) {
        console.error('Error adding activity:', error);
        alert('Could not add activity. Please try again.');
      }
    }
  };

  // Handle moving existing scheduled activity
  const handleScheduledActivityMove = (draggedData, dropData) => {
    const activity = draggedData.activity;
    
    console.log('Scheduled activity move:', { activity, dropData });

    if (dropData.type === 'timeslot') {
      // Move to new time slot
      try {
        updateActivity(activity.id, dropData.day, {
          time: dropData.time,
          day: dropData.day
        });
        console.log('Activity moved to new time slot');
      } catch (error) {
        console.error('Error moving activity:', error);
        alert('Could not move activity. Please try again.');
      }
    } else if (dropData.type === 'timeline' && dropData.day !== activity.day) {
      // Move to different day - show time selection modal
      setPendingActivity(activity);
      setPendingDropData({ 
        ...dropData, 
        suggestedTime: activity.time || '09:00',
        isMove: true 
      });
      setShowTimeModal(true);
    }
  };

  // Handle time selection confirmation
  const handleTimeConfirm = (activityWithTime) => {
    try {
      if (pendingDropData?.isMove) {
        // Moving existing activity
        updateActivity(pendingActivity.id, pendingActivity.day, {
          time: activityWithTime.time,
          duration: activityWithTime.duration,
          day: activityWithTime.day
        });
        console.log('Activity moved with new time');
      } else {
        // Adding new activity at chosen time
        addActivity(pendingActivity, activityWithTime.day, activityWithTime.time);
        console.log('Activity added with selected time');
      }
    } catch (error) {
      console.error('Error handling time confirmation:', error);
      alert('Could not schedule activity. Please try again.');
    }
    
    // Reset state
    setPendingActivity(null);
    setPendingDropData(null);
  };

  // Handle time selection cancellation
  const handleTimeCancel = () => {
    setPendingActivity(null);
    setPendingDropData(null);
    setShowTimeModal(false);
  };

  // State for activity context
  const [activityContext, setActivityContext] = useState(null);

  // Listen for place search requests from cards
  useEffect(() => {
    const handler = async (e) => {
      const { query, activity } = e.detail || {};
      if (!query) return;
      
      // Set activity context for smart search
      setActivityContext(activity || null);
      
      // Get user location if not available
      if (!userLocation && navigator.geolocation) {
        const ok = confirm('Use your current location to find nearby places?');
        if (ok) {
          try {
            const position = await new Promise((resolve, reject) => 
              navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } catch (err) {
            console.warn('Location access denied:', err);
          }
        }
      }
      
      // Open the NearbyPanel
      setShowPlaces(true);
    };
    
    window.addEventListener('places:findNearby', handler);
    return () => window.removeEventListener('places:findNearby', handler);
  }, [userLocation]);

  // Listen for vibe modal open
  useEffect(() => {
    const open = (e) => {
      const { activityId, day, name } = e.detail || {};
      setVibeTarget({ activityId, day, name });
      setShowVibeModal(true);
    };
    window.addEventListener('vibe:open', open);
    return () => window.removeEventListener('vibe:open', open);
  }, []);

  // Listen for edit modal open
  useEffect(() => {
    const openEdit = (e) => {
      const { activity } = e.detail || {};
      setEditingActivity(activity);
      setShowEditModal(true);
    };
    window.addEventListener('activity:edit', openEdit);
    return () => window.removeEventListener('activity:edit', openEdit);
  }, []);

  // Simple PDF generation using only jsPDF
  const generateSchedulePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      
      // Get activities data
      const saturdayActivities = getDayActivities('saturday');
      const sundayActivities = getDayActivities('sunday');
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Weekend Schedule', 20, 20);
      
      // Date
      doc.setFontSize(12);
      const dateText = `${weekendDatesState.start || 'Saturday'} - ${weekendDatesState.end || 'Sunday'}`;
      doc.text(dateText, 20, 30);
      
      let y = 50;
      
      // Saturday
      doc.setFontSize(16);
      doc.text('Saturday', 20, y);
      y += 10;
      
      if (saturdayActivities.length === 0) {
        doc.setFontSize(10);
        doc.text('No activities planned', 25, y);
        y += 10;
      } else {
        saturdayActivities.forEach((activity) => {
          doc.setFontSize(10);
          doc.text(`${activity.time || '00:00'} - ${activity.name || 'Activity'}`, 25, y);
          y += 6;
          if (activity.category) {
            doc.text(`   Category: ${activity.category}`, 25, y);
            y += 6;
          }
          y += 4;
        });
      }
      
      y += 10;
      
      // Sunday
      doc.setFontSize(16);
      doc.text('Sunday', 20, y);
      y += 10;
      
      if (sundayActivities.length === 0) {
        doc.setFontSize(10);
        doc.text('No activities planned', 25, y);
        y += 10;
      } else {
        sundayActivities.forEach((activity) => {
          doc.setFontSize(10);
          doc.text(`${activity.time || '00:00'} - ${activity.name || 'Activity'}`, 25, y);
          y += 6;
          if (activity.category) {
            doc.text(`   Category: ${activity.category}`, 25, y);
            y += 6;
          }
          y += 4;
        });
      }
      
      // Save the PDF
      doc.save('weekend-schedule.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`PDF generation failed: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <MobileTouchOptimizer>
        <div className="h-screen bg-gradient-to-br from-coral-50 via-white to-teal-50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-coral-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs md:text-sm">W</span>
                </div>
                <h1 className="text-lg md:text-xl font-bold text-gray-800">Weekendly</h1>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateSchedulePDF}
                  disabled={isGeneratingPDF}
                  className="hidden md:flex items-center space-x-2"
                >
                  {isGeneratingPDF ? (
                    <div className="w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span>{isGeneratingPDF ? 'Generating...' : 'Share PDF'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className="hidden md:flex items-center space-x-2"
                >
                  <BarChart3 size={16} />
                  <span>Analytics</span>
                </Button>
                
                {/* Mobile PDF Export */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateSchedulePDF}
                  disabled={isGeneratingPDF}
                  className="md:hidden p-2"
                >
                  {isGeneratingPDF ? (
                    <div className="w-4 h-4 border-2 border-coral-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
            <ResponsiveLayout
              leftPanel={
                <div className="h-full flex flex-col mobile-scroll-container">
                  <ActivityBrowser />
                </div>
              }
              rightPanel={
                <div className="h-full flex flex-col mobile-scroll-container" data-schedule-container>
                  <div className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm text-gray-600 bg-white border-b border-gray-100">
                    <span className="font-medium">Weekend:</span> {weekendDatesState.start || 'Sat'} → {weekendDatesState.end || 'Sun'}
                  </div>
                  <WeekendSchedule weekendDates={{ start: weekendDatesState.start, end: weekendDatesState.end }} />
                </div>
              }
              leftPanelTitle="Activities"
              rightPanelTitle="Schedule"
              className="mobile-optimized"
            />
          </div>
          
          {/* Nearby Places Panel */}
          <NearbyPanel
            isOpen={showPlaces}
            onClose={() => {
              setShowPlaces(false);
              setActivityContext(null);
            }}
            onAddActivity={(activity, time) => {
              // Add the activity to the schedule
              addActivity(activity, selectedDay, time);
              setShowPlaces(false);
              setActivityContext(null);
            }}
            userLocation={userLocation}
            selectedDay={selectedDay}
            activityContext={activityContext}
          />

          {/* Analytics Panel */}
          {showVibeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowVibeModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-lg font-semibold text-gray-800 mb-2">How did it feel?</div>
                <div className="text-sm text-gray-600 mb-4">{vibeTarget?.name}</div>
                <div className="grid grid-cols-3 gap-2">
                  {['happy', 'relaxed', 'energetic'].map((v) => (
                    <button
                      key={v}
                      className="px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 capitalize"
                      onClick={() => {
                        if (vibeTarget) {
                          updateActivity(vibeTarget.activityId, vibeTarget.day, { mood: v });
                        }
                        // Trigger celebration effect
                        setShowCelebration(true);
                        setShowVibeModal(false);
                        setVibeTarget(null);
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
          {showAnalytics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAnalytics(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAnalytics(false)}
                    >
                      <Settings size={16} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MoodTracker />
                    <StatusTracker />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          
          {/* Time Selection Modal */}
          <TimeSelectionModal
            isOpen={showTimeModal}
            onClose={handleTimeCancel}
            onConfirm={handleTimeConfirm}
            activity={pendingActivity}
            selectedDay={pendingDropData?.day || selectedDay}
            suggestedTime={pendingDropData?.suggestedTime || '09:00'}
          />
          
          {/* Edit Activity Modal */}
          {showEditModal && editingActivity && (
            <TimeSelectionModal
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingActivity(null);
              }}
              onConfirm={(updatedActivity) => {
                updateActivity(editingActivity.id, editingActivity.day, {
                  time: updatedActivity.time,
                  duration: updatedActivity.duration
                });
                setShowEditModal(false);
                setEditingActivity(null);
              }}
              activity={editingActivity}
              selectedDay={editingActivity.day}
              suggestedTime={editingActivity.time}
            />
          )}
          
          {/* Mobile Analytics Button */}
          <div className="fixed bottom-4 right-4 md:hidden">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAnalytics(true)}
              className="w-14 h-14 rounded-full shadow-lg"
            >
              <BarChart3 size={20} />
            </Button>
          </div>
          
          {/* Drag Overlay */}
          <DragOverlay>
            {activeId && draggedActivity ? (
              <DragOverlayCard activity={draggedActivity} />
            ) : null}
          </DragOverlay>
        </div>

        {/* Celebration Effect */}
        <CelebrationEffect
          isVisible={showCelebration}
          onComplete={() => setShowCelebration(false)}
          duration={3000}
        />
      </MobileTouchOptimizer>
    </DndContext>
  );
};

const PlannerPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading planner...</p>
      </div>

    </div>}>
      <PlannerPageContent />
    </Suspense>
  );
};

export default PlannerPage;