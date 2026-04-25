import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './Navbar';
import CustomCursor from './CustomCursor';
import PerspectiveGrid from './PerspectiveGrid';
import NetworkBackground from './NetworkBackground';

export default function Layout({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans relative overflow-x-hidden">
      {/* Global FX */}
      <CustomCursor />
      <PerspectiveGrid />
      <NetworkBackground />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 md:mt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
