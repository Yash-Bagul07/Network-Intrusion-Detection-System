import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Check if hovering over interactive elements
      if (
        e.target.tagName === 'A' || 
        e.target.tagName === 'BUTTON' || 
        e.target.closest('a') !== null || 
        e.target.closest('button') !== null ||
        e.target.classList.contains('interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      width: 16,
      height: 16,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '0px solid rgba(0, 255, 255, 0)',
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      width: 48,
      height: 48,
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
      border: '1px solid rgba(0, 255, 255, 0.8)',
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
      variants={variants}
      animate={isHovered ? 'hover' : 'default'}
      transition={{ 
        type: 'spring', 
        damping: 30, // Smooth following
        stiffness: 250,
        mass: 0.5 
      }}
    />
  );
}
