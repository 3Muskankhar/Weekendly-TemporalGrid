'use client';

import { useEffect, useState } from 'react';

const MobileTouchOptimizer = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  
  useEffect(() => {
    // Detect touch device
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    
    // Add touch event listeners for better mobile experience
    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
      setTouchStartX(e.touches[0].clientX);
    };
    
    const handleTouchMove = (e) => {
      // Prevent default behavior for horizontal swipes
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = Math.abs(touchY - touchStartY);
      const deltaX = Math.abs(touchX - touchStartX);
      
      if (deltaX > deltaY) {
        // Horizontal swipe - prevent default to avoid page scroll
        e.preventDefault();
      }
    };
    
    if (isTouchDevice) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (isTouchDevice) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [isTouchDevice, touchStartY, touchStartX]);
  
  // Add mobile-specific CSS classes
  useEffect(() => {
    if (isTouchDevice) {
      document.body.classList.add('touch-device');
      document.body.classList.add('mobile-optimized');
    } else {
      document.body.classList.remove('touch-device');
      document.body.classList.remove('mobile-optimized');
    }
    
    return () => {
      document.body.classList.remove('touch-device');
      document.body.classList.remove('mobile-optimized');
    };
  }, [isTouchDevice]);
  
  return (
    <div className={`mobile-touch-optimizer ${isTouchDevice ? 'touch-device' : 'no-touch'}`}>
      {children}
    </div>
  );
};

export default MobileTouchOptimizer;
