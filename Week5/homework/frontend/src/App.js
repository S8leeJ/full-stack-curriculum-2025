// Import necessary modules from their respective packages
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./contexts/AuthContext"; // Custom context for authentication
import HomePage from "./components/HomePage"; // Component for the homepage
import LoginPage from "./components/LoginPage"; // Component for the login page
import { CssBaseline } from "@mui/material"; // For consistent baseline styling
import theme from "./Theme"; // Custom theme settings
import RegisterPage from "./components/RegisterPage"; // Component for the registration page
// The main App component
function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
export default App;