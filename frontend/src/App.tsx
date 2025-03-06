import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Security from './pages/Security';
import Assignment from './pages/Assignment';
import Worksite from './pages/admin/Worksite';
import People from './pages/admin/People';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Security />} />
          <Route
            path="/"
            element={
              <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                <MainLayout>
                  <Assignment />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/worksite"
            element={
              <ProtectedRoute roles={['ROLE_ADMIN']}>
                <MainLayout>
                  <Worksite />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/people"
            element={
              <ProtectedRoute roles={['ROLE_ADMIN']}>
                <MainLayout>
                  <People />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
