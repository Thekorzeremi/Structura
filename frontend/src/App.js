import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/register" element={<AuthPage type="register" />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
