import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './security/AuthContext';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assignement from './pages/Assignement';
import Worksite from './pages/Worksite';
import People from './pages/People';
import ProtectedRoute from './security/ProtectedRoute';

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <div className="min-h-screen min-w-screen bg-[#f7f9fc] flex">
          <Navbar />
          <div className="flex-1 ml-[75px] min-h-screen border-l border-black/10">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignment"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}>
                    <Assignement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worksite"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <Worksite />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/people"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <People />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </MantineProvider>
  );
}
