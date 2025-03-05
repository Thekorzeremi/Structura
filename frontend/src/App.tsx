import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './security/AuthContext';
import ProtectedRoute from './security/ProtectedRoute';
import Security from './pages/Security';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen w-screen bg-[#f7f9fc] flex">
          <Routes>
            <Route path="/login" element={<Security />} />
            <Route path="/unauthorized" element={<Security />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
