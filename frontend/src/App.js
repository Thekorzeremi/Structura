import '@mantine/core/styles.css';
import { Button } from '@mantine/core';
import { MantineProvider } from '@mantine/core';

export default function App() {
  return <>
  
        <MantineProvider>
          
            <Button variant="filled" >Button</Button>

        </MantineProvider>

    </>   
}
