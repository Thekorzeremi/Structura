import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Security from './pages/Security';
import Assignment from './pages/Assignment';
import Worksite from './pages/Worksite';
import People from './pages/People';
import Settings from './pages/Settings';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#f7f9fc]">
          <Routes>
            <Route path="/login" element={<Security />} />
            <Route
              path="/"
              element={
                <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <>
                    <Navbar />
                    <Home />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignment"
              element={
                <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <>
                    <Navbar />
                    <Assignment />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/worksite"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN']}>
                  <>
                    <Navbar />
                    <Worksite />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/people"
              element={
                <ProtectedRoute roles={['ROLE_ADMIN']}>
                  <>
                    <Navbar />
                    <People />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                  <>
                    <Navbar />
                    <Settings />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
