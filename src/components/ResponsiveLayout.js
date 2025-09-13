'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

const ResponsiveLayout = ({ 
  leftPanel, 
  rightPanel, 
  leftPanelTitle = 'Activities',
  rightPanelTitle = 'Schedule',
  className = '' 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [activePanel, setActivePanel] = useState('both');
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle panel switching on mobile
  const handlePanelSwitch = (panel) => {
    setActivePanel(panel);
    if (panel === 'left') {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(false);
    } else if (panel === 'right') {
      setIsLeftPanelOpen(false);
      setIsRightPanelOpen(true);
    } else {
      setIsLeftPanelOpen(true);
      setIsRightPanelOpen(true);
    }
  };
  
  // Mobile panel toggle
  const toggleLeftPanel = () => {
    setIsLeftPanelOpen(!isLeftPanelOpen);
    if (isLeftPanelOpen) {
      setIsRightPanelOpen(true);
      setActivePanel('right');
    } else {
      setActivePanel('left');
    }
  };
  
  const toggleRightPanel = () => {
    setIsRightPanelOpen(!isRightPanelOpen);
    if (isRightPanelOpen) {
      setIsLeftPanelOpen(true);
      setActivePanel('left');
    } else {
      setActivePanel('right');
    }
  };
  
  if (isMobile) {
    return (
      <div className={`h-screen flex flex-col ${className}`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLeftPanel}
              className={`${isLeftPanelOpen ? 'text-coral-600' : 'text-gray-500'}`}
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              {activePanel === 'left' ? leftPanelTitle : rightPanelTitle}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRightPanel}
              className={`${isRightPanelOpen ? 'text-coral-600' : 'text-gray-500'}`}
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
        
        {/* Mobile Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLeftPanelOpen && activePanel === 'left' && (
              <motion.div
                key="left-panel"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 z-10"
              >
                {leftPanel}
              </motion.div>
            )}
            
            {isRightPanelOpen && activePanel === 'right' && (
              <motion.div
                key="right-panel"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 z-10"
              >
                {rightPanel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex items-center justify-center p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              variant={activePanel === 'left' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePanelSwitch('left')}
              className="flex items-center space-x-2"
            >
              <span>{leftPanelTitle}</span>
            </Button>
            
            <Button
              variant={activePanel === 'right' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePanelSwitch('right')}
              className="flex items-center space-x-2"
            >
              <span>{rightPanelTitle}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className={`h-screen flex ${className}`}>
      {/* Left Panel */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-1/2 border-r border-gray-200"
      >
        {leftPanel}
      </motion.div>
      
      {/* Right Panel */}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
        className="w-1/2"
      >
        {rightPanel}
      </motion.div>
    </div>
  );
};

export default ResponsiveLayout;
