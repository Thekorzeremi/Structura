import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assignement from './pages/Assignement';
import Worksite from './pages/Worksite';
import People from './pages/People';

export default function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <div className="min-h-screen min-w-screen bg-[#f7f9fc] flex">
          <Navbar />
          <div className="flex-1 ml-[75px] min-h-screen border-l border-black/10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assignment" element={<Assignement />} />
              <Route path="/worksite" element={<Worksite />} />
              <Route path="/people" element={<People />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </MantineProvider>
  );
}
