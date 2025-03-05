import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <MantineProvider>
      <div className="min-h-screen min-w-screen bg-gray-100">
        <Navbar />
      </div>
    </MantineProvider>
  );
}
