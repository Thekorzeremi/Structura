import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";


function App() {
  return (
    <MantineProvider>
        <Router>
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                
            </Routes>

        </Router>
    </MantineProvider>
  );
}

export default App;
