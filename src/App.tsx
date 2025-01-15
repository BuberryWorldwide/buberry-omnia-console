import React from "react";
import { BrowserRouter as Router } from "react-router-dom"; // Ensure Router wraps the app
import Footer from "./components/Footer";
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/Navbar";
import { Box, ThemeProvider } from "@mui/material";
import { AllWalletsProvider } from "./services/wallets/AllWalletsProvider";
import AppRouter from "./AppRouter";
import theme from "./retrotheme";
import "./App.css";
import mdcHelpPage from "./pages/MdcHelpPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AllWalletsProvider>
          <CssBaseline />
          <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url('/assets/background-image.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

          
            <header>
              <NavBar />
            </header>
            <Box flex={1} p={3}>
              <AppRouter /> {/* AppRouter no longer contains its own <Router> */}
            </Box>
            <Footer />
          </Box>
        </AllWalletsProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;