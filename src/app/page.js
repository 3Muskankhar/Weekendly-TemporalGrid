'use client';

import { motion } from 'framer-motion';
import { Button, Card, Icon } from '@/components/ui';
import { Calendar, Sparkles, Heart, Zap, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PredefinedWeekendPlans from '@/components/PredefinedWeekendPlans';

export default function Home() {
  const router = useRouter();
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPredefinedPlans, setShowPredefinedPlans] = useState(false);
  const [saturdayDate, setSaturdayDate] = useState('');
  const [sundayDate, setSundayDate] = useState('');

  const openDateModal = () => setShowDateModal(true);
  const closeDateModal = () => setShowDateModal(false);
  const openPredefinedPlans = () => setShowPredefinedPlans(true);
  const closePredefinedPlans = () => setShowPredefinedPlans(false);

  const handleSaturdayChange = (val) => {
    setSaturdayDate(val);
    if (val) {
      const d = new Date(val);
      const sun = new Date(d);
      sun.setDate(d.getDate() + 1);
      const sunIso = sun.toISOString().slice(0, 10);
      setSundayDate(sunIso);
    } else {
      setSundayDate('');
    }
  };

  const confirmDatesAndGo = () => {
    if (!saturdayDate) {
      alert('Please choose a Saturday date');
      return;
    }
    const day = new Date(saturdayDate).getDay();
    if (day !== 6) {
      alert('Please select a Saturday');
      return;
    }
    // Persist for planner
    if (typeof window !== 'undefined') {
      localStorage.setItem('weekendly:weekendDates', JSON.stringify({ start: saturdayDate, end: sundayDate }));
    }
    router.push(`/planner?start=${saturdayDate}&end=${sundayDate}`);
  };

  const handlePredefinedPlan = (plan) => {
    // Store the selected plan and show date picker
    if (typeof window !== 'undefined') {
      localStorage.setItem('weekendly:predefinedPlan', JSON.stringify(plan));
    }
    
    closePredefinedPlans();
    setShowDateModal(true);
  };

  const confirmDatesAndGoWithPlan = () => {
    if (!saturdayDate) {
      alert('Please choose a Saturday date');
      return;
    }
    const day = new Date(saturdayDate).getDay();
    if (day !== 6) {
      alert('Please select a Saturday');
      return;
    }
    
    // Persist for planner
    if (typeof window !== 'undefined') {
      localStorage.setItem('weekendly:weekendDates', JSON.stringify({ start: saturdayDate, end: sundayDate }));
    }
    
    // Check if we have a predefined plan
    const storedPlan = localStorage.getItem('weekendly:predefinedPlan');
    if (storedPlan) {
      const plan = JSON.parse(storedPlan);
      router.push(`/planner?start=${saturdayDate}&end=${sundayDate}&plan=${plan.title.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      router.push(`/planner?start=${saturdayDate}&end=${sundayDate}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-white to-teal-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-coral-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-coral-600 to-teal-600 bg-clip-text text-transparent">
              Weekendly
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button variant="primary" size="md" onClick={openDateModal}>
              Start Planning
            </Button>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-coral-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
                Design Your
              </span>
              <br />
              <span className="text-gray-800">Perfect Weekend</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create beautiful weekend schedules with drag-and-drop activities, 
              mood tracking, and visual timelines. Make every weekend count!
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={openDateModal}>
              <Sparkles className="w-5 h-5 mr-2" />
              Start Planning Now
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={openPredefinedPlans}>
              <Wand2 className="w-5 h-5 mr-2" />
              Quick Weekend Plans
            </Button>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card variant="gradient" hover className="text-center p-8">
            <div className="w-16 h-16 bg-coral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-coral-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Visual Timeline</h3>
            <p className="text-gray-600">
              See your weekend plan in a beautiful timeline format with drag-and-drop scheduling.
            </p>
          </Card>

          <Card variant="gradient" hover className="text-center p-8">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Mood Tracking</h3>
            <p className="text-gray-600">
              Assign vibes and moods to activities to understand your weekend energy flow.
            </p>
          </Card>

          <Card variant="gradient" hover className="text-center p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Features</h3>
            <p className="text-gray-600">
              Status tracking, persistence, and smooth animations for the best experience.
            </p>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card variant="elevated" className="max-w-2xl mx-auto p-12 bg-gradient-to-br from-coral-50 to-teal-50 border-0">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Ready to Plan Your Perfect Weekend?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of users who are already making their weekends more intentional and fun.
            </p>
            <Link href="/planner">
              <Button variant="primary" size="lg">
                Get Started Free
              </Button>
            </Link>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-20">
        <div className="text-center text-gray-500">
          <p>&copy; 2025 Weekendly. Made with ❤️ for better weekends.</p>
        </div>
      </footer>

      {/* Date Picker Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeDateModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="text-coral-600" />
              <h3 className="text-lg font-semibold text-gray-800">Choose your weekend</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Saturday</label>
                <input type="date" className="w-full border border-gray-200 rounded-md p-2" value={saturdayDate} onChange={(e) => handleSaturdayChange(e.target.value)} />
                {saturdayDate && new Date(saturdayDate).getDay() !== 6 && (
                  <div className="text-xs text-red-500 mt-1">Please pick a Saturday.</div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sunday (auto)</label>
                <input type="date" className="w-full border border-gray-200 rounded-md p-2 bg-gray-50" value={sundayDate} readOnly />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button className="flex-1 border border-gray-200 rounded-md py-2" onClick={closeDateModal}>Cancel</button>
              <button className="flex-1 bg-coral-600 text-white rounded-md py-2" onClick={confirmDatesAndGoWithPlan}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {/* Predefined Plans Modal */}
      {showPredefinedPlans && (
        <PredefinedWeekendPlans
          onSelectPlan={handlePredefinedPlan}
          onClose={closePredefinedPlans}
        />
      )}
    </div>
  );
}
