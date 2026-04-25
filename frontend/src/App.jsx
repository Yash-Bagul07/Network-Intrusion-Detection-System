import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Predict from './pages/Predict';
import RealTimeDetection from './pages/RealTimeDetection';
import TypesOfAttacks from './pages/TypesOfAttacks';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/predict" element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          } />
          <Route path="/real-time" element={
            <ProtectedRoute>
              <RealTimeDetection />
            </ProtectedRoute>
          } />
          <Route path="/attacks" element={
            <ProtectedRoute>
              <TypesOfAttacks />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
