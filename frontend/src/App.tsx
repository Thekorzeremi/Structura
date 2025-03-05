import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Security from './pages/Security';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

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
                <ProtectedRoute>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#007AFF] mb-4">
                      Bienvenue sur Structura
                    </h1>
                    <div className="bg-white rounded-lg shadow-sm border border-[#E5E5E5] p-6">
                      <p className="text-gray-700">
                        Vous êtes connecté avec succès !
                      </p>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => {
                          localStorage.removeItem('token');
                          window.location.href = '/login';
                        }}
                      >
                        Logout
                      </button>

                    </div>
                  </div>
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
