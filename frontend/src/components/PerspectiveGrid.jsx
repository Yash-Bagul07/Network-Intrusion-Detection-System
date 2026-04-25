import React from 'react';

export default function PerspectiveGrid() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-[50vh] z-0 overflow-hidden pointer-events-none opacity-40">
      {/* Fade out mask at the top */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-950 via-dark-950/80 to-transparent z-10" />
      
      {/* The Grid */}
      <div 
        className="absolute bottom-[-10vh] left-[-50vw] w-[200vw] h-[100vh]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          transform: 'perspective(1000px) rotateX(70deg)',
          transformOrigin: 'bottom center',
        }}
      />
      
      {/* Deep glow at the horizon line */}
      <div className="absolute bottom-[20vh] left-0 w-full h-[20vh] bg-primary-500/10 blur-[100px] z-0" />
    </div>
  );
}
