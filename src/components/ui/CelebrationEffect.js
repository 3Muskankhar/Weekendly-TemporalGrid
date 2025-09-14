'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CelebrationEffect = ({ isVisible, onComplete, duration = 3000 }) => {
  const [confetti, setConfetti] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: `confetti-${i}`,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.8,
        color: getRandomColor(),
        size: Math.random() * 10 + 6,
        velocity: Math.random() * 3 + 2
      }));

      // Generate sparkle particles
      const newSparkles = Array.from({ length: 25 }, (_, i) => ({
        id: `sparkle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
        scale: Math.random() * 0.8 + 0.4
      }));
      
      setConfetti(newConfetti);
      setSparkles(newSparkles);

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
      setSparkles([]);
    }
  }, [isVisible, duration, onComplete]);

  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Confetti particles */}
      <AnimatePresence>
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}vw`, 
              y: `${particle.y}vh`, 
              rotate: particle.rotation,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              x: `${particle.x + (Math.random() - 0.5) * 30}vw`,
              y: '120vh',
              rotate: particle.rotation + 720,
              opacity: [1, 1, 0.8, 0],
              scale: [1, 1.2, 0.8, 0]
            }}
            exit={{ 
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: particle.delay,
              ease: "easeOut"
            }}
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '3px',
              boxShadow: `0 0 6px ${particle.color}40`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Sparkle effects */}
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              x: `${sparkle.x}vw`, 
              y: `${sparkle.y}vh`, 
              scale: 0,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              scale: [0, sparkle.scale * 2.5, sparkle.scale * 1.5, 0],
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2.5,
              delay: sparkle.delay,
              ease: "easeInOut"
            }}
            className="absolute text-yellow-400 text-3xl select-none"
            style={{
              left: 0,
              top: 0,
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))'
            }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating celebration emojis */}
      <AnimatePresence>
        {[  '✨'].map((emoji, i) => (
          <motion.div
            key={`emoji-${i}`}
            initial={{ 
              x: `${15 + i * 12}vw`, 
              y: '110vh', 
              scale: 0,
              rotate: 0
            }}
            animate={{ 
              x: `${15 + i * 12 + (Math.random() - 0.5) * 15}vw`,
              y: '-15vh',
              scale: [0, 2, 1.5, 1, 0],
              rotate: [0, 180, 360, 540]
            }}
            transition={{
              duration: 5,
              delay: i * 0.15,
              ease: "easeOut"
            }}
            className="absolute text-5xl select-none"
            style={{
              left: 0,
              top: 0,
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Background celebration pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.15, 0.1, 0],
          scale: [0.8, 1.1, 1, 0.9]
        }}
        transition={{ 
          duration: 3,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 rounded-3xl"
      />

      {/* Radial burst effect */}
      <AnimatePresence>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`burst-${i}`}
            initial={{
              x: '50vw',
              y: '50vh',
              scale: 0,
              rotate: i * 30
            }}
            animate={{
              x: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}vw`,
              y: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}vh`,
              scale: [0, 1, 0],
              rotate: i * 30 + 180
            }}
            transition={{
              duration: 2,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full"
            style={{
              boxShadow: '0 0 12px rgba(255, 215, 0, 0.8)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CelebrationEffect;
