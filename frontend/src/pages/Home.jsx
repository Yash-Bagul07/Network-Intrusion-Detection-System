import React, { useEffect, useRef } from 'react';
import { Shield, Zap, Activity, Cpu, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for hero text
      gsap.fromTo('.reveal-text', 
        { y: 60, opacity: 0, rotationX: -20 }, 
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', transformOrigin: 'bottom' }
      );
      
      // Floating cards animation
      gsap.fromTo('.cyber-card',
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.5)', delay: 0.8 }
      );

      // Side numbering reveal
      gsap.fromTo('.side-num',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.3, delay: 0.5, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[85vh] flex flex-col justify-center pt-20">
      
      {/* Absolute Side Navigation (Vertical Indicators) */}
      <div className="absolute left-0 top-[20%] hidden lg:flex flex-col gap-12 font-mono text-xs text-gray-600">
        {['01 // INIT', '02 // DETECT', '03 // ACT'].map((num, i) => (
          <div key={i} className="side-num flex items-center gap-4 -rotate-90 origin-left translate-x-4">
            <span className="tracking-[0.2em]">{num}</span>
            <div className="w-8 h-[1px] bg-white/20"></div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto z-10 w-full pl-0 lg:pl-16">
        <div className="space-y-6 mb-16">
          <div className="reveal-text inline-flex items-center gap-3 px-4 py-1 border border-primary-500/30 bg-primary-500/5 text-primary-400 font-mono text-xs tracking-[0.2em] mb-4 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
            [ SYSTEM STATUS: ARMED ]
          </div>
          
          <h1 className="reveal-text text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            OMNISCIENT <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-white to-gray-500 text-glow">
              THREAT ENGINE
            </span>
          </h1>
          
          <p className="reveal-text text-lg md:text-xl text-gray-400 max-w-2xl font-sans font-light leading-relaxed">
            Deploy deep-packet inspection and machine learning models at the edge. 
            Identify zero-day payloads, visualize traffic anomalies, and secure your nodes dynamically.
          </p>

          <div className="reveal-text pt-8 flex items-center gap-6">
            <Link to="/real-time" className="interactive group relative overflow-hidden px-8 py-4 bg-white text-black font-bold tracking-tight transition-transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                INITIATE DASHBOARD <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-primary-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
            </Link>
            <Link to="/predict" className="interactive text-gray-400 font-mono text-sm tracking-widest hover:text-white transition-colors flex items-center gap-2">
              // MANUAL_SCAN <span className="w-6 h-[1px] bg-gray-500"></span>
             </Link>
          </div>
        </div>

        {/* Feature Cards Grid (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-10 border-t border-white/5">
          {[
            { icon: Activity, title: 'DEEP PACKET', desc: 'Real-time wire-speed analysis down to byte-level signatures.' },
            { icon: Cpu, title: 'ML INFERENCE', desc: 'XGBoost & Forest models detecting behavioral anomalies instantly.' },
            { icon: Shield, title: 'ZERO-DAY SHIELD', desc: 'Heuristic pattern recognition blocks unseen variants dynamically.' }
          ].map((feature, i) => (
            <div key={i} className="cyber-card interactive glass-card p-6 group cursor-none">
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 mb-6 group-hover:border-primary-400 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300">
                <feature.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-sm font-mono font-bold text-white mb-3 tracking-widest">{feature.title}</h3>
              <p className="text-gray-500 text-sm font-sans leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
