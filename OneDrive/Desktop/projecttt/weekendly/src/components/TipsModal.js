'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Play, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { getActivityTips } from '@/utils/geminiTips';

const TipsModal = ({ 
  isOpen, 
  onClose, 
  activity 
}) => {
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTips = useCallback(async () => {
    if (!activity) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const tipsData = await getActivityTips(activity);
      setTips(tipsData);
    } catch (err) {
      console.error('Error loading tips:', err);
      setError('Failed to load tips. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [activity]);

  useEffect(() => {
    if (isOpen && activity) {
      loadTips();
    }
  }, [isOpen, activity, loadTips]);

  if (!isOpen || !activity) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-coral-50 to-teal-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <Lightbulb size={20} className="text-coral-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Tips & Guidance</h2>
                <p className="text-sm text-gray-600">{activity.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading tips...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="text-red-300 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadTips} variant="primary" size="sm">
                Try Again
              </Button>
            </div>
          ) : tips ? (
            <div className="space-y-6">
              {/* Tips */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Practical Tips
                </h3>
                <ul className="space-y-2">
                  {tips.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Materials */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">What You&apos;ll Need</h3>
                <div className="flex flex-wrap gap-2">
                  {tips.materials.map((material, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Beginner Advice */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Beginner Advice</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{tips.beginnerAdvice}</p>
              </Card>

              {/* Videos
              {tips.videos && tips.videos.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Play size={16} className="text-blue-500" />
                    Reference Videos
                  </h3>
                  <div className="space-y-3">
                    {tips.videos.map((video, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-800">{video.title}</p>
                          <p className="text-xs text-gray-600">{video.channel}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(video.url, '_blank')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )} */}

              {/* Common Mistakes */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-orange-500" />
                  Common Mistakes to Avoid
                </h3>
                <ul className="space-y-1">
                  {tips.mistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 mt-1">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Source */}
              <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
                Tips provided by {tips.source === 'ai' ? 'AI Assistant' : 'Default Guide'}
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TipsModal;
