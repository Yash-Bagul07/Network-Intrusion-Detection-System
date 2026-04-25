import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', label: '// HOME' },
  { path: '/real-time', label: '// MONITOR' },
  { path: '/predict', label: '// PREDICT' },
  { path: '/attacks', label: '// ATTACKS' },
  { path: '/about', label: '// ABOUT' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-dark-950/60 border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3 interactive">
          <div className="p-2 border border-primary-500/30 rounded-none bg-dark-900 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
            <Shield className="text-primary-400 h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold font-sans tracking-[0.2em] text-white">
            SENTINEL<span className="text-primary-500">.AI</span>
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-xs font-mono tracking-wider transition-all duration-300 interactive ${
                  isActive
                    ? 'text-primary-400 text-glow-primary'
                    : 'text-gray-500 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Status & Auth */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-gray-400 tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            [ ONLINE ]
          </div>
          
          <div className="h-4 w-px bg-white/10"></div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-primary-400 flex items-center gap-2 border border-primary-500/20 bg-primary-500/5 px-3 py-1.5 shadow-[0_0_8px_rgba(0,255,255,0.1)]">
                 <User className="w-3 h-3" />
                 {user.username}
              </span>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 interactive flex items-center gap-2 transition-colors">
                <LogOut className="w-3 h-3" />
                [ LOGOUT ]
              </button>
            </div>
          ) : (
             <div className="flex items-center gap-3">
                <NavLink to="/login" className="text-gray-400 hover:text-primary-400 transition-colors interactive">
                  [ LOGIN ]
                </NavLink>
                <NavLink to="/register" className="text-primary-400 hover:text-primary-300 transition-colors interactive">
                  [ REGISTER ]
                </NavLink>
             </div>
          )}
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-gray-500 hover:text-white interactive">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
