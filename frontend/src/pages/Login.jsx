import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/real-time');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md relative">
        {/* Glow Effects */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-primary-600/0 blur-xl opacity-50"></div>
        
        <div className="relative glass-panel p-8 border border-white/10 cyber-corners">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 border border-primary-500/30 bg-dark-900 shadow-[0_0_15px_rgba(0,255,255,0.2)] flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white mb-2">AUTH_SYSTEM</h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">USERNAME / EMAIL</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-sm focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-white font-mono text-sm transition-all"
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">PASSWORD</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-sm focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-white font-mono text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-400 font-mono text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              {isLoading ? 'AUTHENTICATING...' : '[ LOGIN ]'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-mono text-gray-500">
            Unregistered? <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors border-b border-primary-400/30 pb-0.5">Initialize Setup_</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
