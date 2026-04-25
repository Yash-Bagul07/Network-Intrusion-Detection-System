import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
     return (
       <div className="flex-1 flex items-center justify-center min-h-[80vh]">
         <div className="text-primary-400 font-mono text-sm tracking-widest animate-pulse">
           [ VERIFYING_ACCESS ]
         </div>
       </div>
     );
  }

  if (!token) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
