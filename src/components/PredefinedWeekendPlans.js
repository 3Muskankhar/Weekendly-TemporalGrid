'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import { 
  Home, 
  Mountain, 
  Heart, 
  Coffee, 
  Gamepad2, 
  BookOpen, 
  Utensils, 
  Camera,
  Music,
  Dumbbell,
  Palette,
  TreePine
} from 'lucide-react';

const PredefinedWeekendPlans = ({ onSelectPlan, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const predefinedPlans = {
    lazy: {
      title: "Lazy Weekend",
      description: "Perfect for relaxation and staying in",
      icon: Home,
      color: "blue",
      activities: [
        { name: "Morning Coffee", category: "food", duration: 30, mood: "relaxed", time: "09:00" },
        { name: "Read a Book", category: "relaxation", duration: 120, mood: "peaceful", time: "09:30" },
        { name: "Netflix & Chill", category: "entertainment", duration: 180, mood: "cozy", time: "14:00" },
        { name: "Order Takeout", category: "food", duration: 60, mood: "satisfied", time: "19:00" },
        { name: "Board Games", category: "entertainment", duration: 90, mood: "fun", time: "20:00" }
      ]
    },
    adventurous: {
      title: "Adventurous Weekend",
      description: "For thrill-seekers and outdoor enthusiasts",
      icon: Mountain,
      color: "green",
      activities: [
        { name: "Early Morning Hike", category: "outdoor", duration: 180, mood: "energetic", time: "07:00" },
        { name: "Rock Climbing", category: "outdoor", duration: 120, mood: "adventurous", time: "10:00" },
        { name: "Adventure Park", category: "outdoor", duration: 240, mood: "thrilled", time: "14:00" },
        { name: "Campfire Dinner", category: "food", duration: 90, mood: "accomplished", time: "19:00" },
        { name: "Stargazing", category: "outdoor", duration: 60, mood: "peaceful", time: "21:00" }
      ]
    },
    family: {
      title: "Family Weekend",
      description: "Fun activities for the whole family",
      icon: Heart,
      color: "pink",
      activities: [
        { name: "Family Breakfast", category: "food", duration: 90, mood: "happy", time: "08:00" },
        { name: "Visit Museum", category: "entertainment", duration: 180, mood: "curious", time: "09:30" },
        { name: "Picnic in Park", category: "outdoor", duration: 120, mood: "joyful", time: "14:00" },
        { name: "Family Movie Night", category: "entertainment", duration: 150, mood: "cozy", time: "18:00" },
        { name: "Bedtime Stories", category: "relaxation", duration: 30, mood: "peaceful", time: "20:30" }
      ]
    },
    creative: {
      title: "Creative Weekend",
      description: "Unleash your artistic side",
      icon: Palette,
      color: "purple",
      activities: [
        { name: "Art Gallery Visit", category: "creative", duration: 120, mood: "inspired", time: "10:00" },
        { name: "Painting Session", category: "creative", duration: 180, mood: "focused", time: "12:00" },
        { name: "Photography Walk", category: "creative", duration: 90, mood: "observant", time: "16:00" },
        { name: "Creative Writing", category: "creative", duration: 60, mood: "thoughtful", time: "19:00" },
        { name: "Music Jam Session", category: "creative", duration: 90, mood: "expressive", time: "20:00" }
      ]
    },
    wellness: {
      title: "Wellness Weekend",
      description: "Focus on health and self-care",
      icon: Dumbbell,
      color: "teal",
      activities: [
        { name: "Morning Yoga", category: "relaxation", duration: 60, mood: "centered", time: "07:00" },
        { name: "Healthy Breakfast", category: "food", duration: 45, mood: "nourished", time: "08:00" },
        { name: "Gym Workout", category: "relaxation", duration: 90, mood: "energized", time: "09:00" },
        { name: "Spa Treatment", category: "relaxation", duration: 120, mood: "pampered", time: "15:00" },
        { name: "Meditation", category: "relaxation", duration: 30, mood: "peaceful", time: "19:00" }
      ]
    },
    social: {
      title: "Social Weekend",
      description: "Connect with friends and community",
      icon: Music,
      color: "orange",
      activities: [
        { name: "Brunch with Friends", category: "social", duration: 120, mood: "social", time: "10:00" },
        { name: "Shopping Spree", category: "errands", duration: 150, mood: "excited", time: "12:00" },
        { name: "Coffee Chat", category: "social", duration: 60, mood: "connected", time: "16:00" },
        { name: "Dinner Party", category: "social", duration: 180, mood: "festive", time: "18:00" },
        { name: "Karaoke Night", category: "entertainment", duration: 120, mood: "fun", time: "21:00" }
      ]
    }
  };

  const handleSelectPlan = (planKey) => {
    setSelectedPlan(planKey);
  };

  const handleConfirmPlan = () => {
    if (selectedPlan) {
      onSelectPlan(predefinedPlans[selectedPlan]);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Home, Mountain, Heart, Coffee, Gamepad2, BookOpen, 
      Utensils, Camera, Music, Dumbbell, Palette, TreePine
    };
    return icons[iconName] || Home;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 bg-blue-50 border-blue-200 text-blue-700",
      green: "from-green-500 to-green-600 bg-green-50 border-green-200 text-green-700",
      pink: "from-pink-500 to-pink-600 bg-pink-50 border-pink-200 text-pink-700",
      purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-700",
      teal: "from-teal-500 to-teal-600 bg-teal-50 border-teal-200 text-teal-700",
      orange: "from-orange-500 to-orange-600 bg-orange-50 border-orange-200 text-orange-700"
    };
    return colors[color] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Choose Your Weekend Style
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          <p className="text-gray-600">
            Select a predefined weekend plan or create your own custom schedule
          </p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(predefinedPlans).map(([key, plan]) => {
              const IconComponent = plan.icon;
              const colorClasses = getColorClasses(plan.color);
              const isSelected = selectedPlan === key;
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? `border-2 border-${plan.color}-500 bg-${plan.color}-50` 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleSelectPlan(key)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{plan.title}</h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 mb-2">
                        {plan.activities.length} activities planned
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {plan.activities.slice(0, 3).map((activity, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {activity.name}
                          </span>
                        ))}
                        {plan.activities.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{plan.activities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedPlan ? (
                <span>Selected: <strong>{predefinedPlans[selectedPlan].title}</strong></span>
              ) : (
                <span>Choose a weekend plan to get started</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleConfirmPlan}
                disabled={!selectedPlan}
              >
                Use This Plan
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PredefinedWeekendPlans;
