import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, try to get user data from localStorage or set it as parsed from token if you wish.
    // Let's rely on simple presence of token and saved user initially.
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
        username,
        password
      });

      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      localStorage.setItem('token', access_token);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed';
      if (error.response && error.response.data && error.response.data.detail) {
        message = error.response.data.detail;
      }
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
        username,
        email,
        password
      });
      return { success: true };
    } catch (error) {
       let message = 'Registration failed';
       if (error.response && error.response.data && error.response.data.detail) {
         if (typeof error.response.data.detail === 'string') {
             message = error.response.data.detail;
         } else {
             // Handle pydantic validation errors nicely
             message = error.response.data.detail[0].msg || 'Invalid input';
         }
       }
       return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
