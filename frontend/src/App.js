import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Affectations from './pages/Affectations';

export default function App() {
  return (
    <MantineProvider>
      <div className="min-h-screen min-w-screen bg-[#f7f9fc] flex">
        <Navbar />
        {/* <div className="flex-1 ml-[75px] min-h-screen border-l border-black/10">
          <Routes>
            <Route path="/affectations" element={<Affectations />} />
          </Routes>
        </div> */}
      </div>
    </MantineProvider>
  );
}
