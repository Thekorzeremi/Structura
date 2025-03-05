import '@mantine/core/styles.css';
import { Button, Paper } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

export default function App() {
  return (
    <MantineProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <Paper className="max-w-md mx-auto p-4 space-y-4" shadow="sm">
          <h1 className="text-2xl font-bold text-gray-800">Test Mantine + Tailwind</h1>
          
          {/* Bouton utilisant Mantine */}
          <Button variant="filled" className="w-full">
            Bouton Mantine
          </Button>

          {/* Bouton utilisant Tailwind */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Bouton Tailwind
          </button>
        </Paper>
      </div>
    </MantineProvider>
  );
}