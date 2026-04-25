import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Mail, CheckCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const result = await register(username, email, password);
    
    if (result.success) {
      setSuccess('Registration protocol complete. Redirecting to Auth...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
            <h2 className="text-2xl font-bold font-mono tracking-widest text-white mb-2">INIT_USER</h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">USERNAME</label>
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
                  placeholder="agent_89"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">EMAIL SECURE_CHANNEL</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-900 border border-white/10 rounded-sm focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-white font-mono text-sm transition-all"
                  placeholder="operator@sentinel.ai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-400 tracking-wider">PASSWORD_HASH</label>
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
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="w-full py-3 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 text-primary-400 font-mono text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group mt-2"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
              {isLoading ? 'PROCESSING...' : '[ ENROLL ]'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs font-mono text-gray-500">
            Existing operator? <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors border-b border-primary-400/30 pb-0.5">Proceed to Auth_</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
