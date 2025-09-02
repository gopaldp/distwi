import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./authContext/AuthContext";
import { ThemeProvider, useThemeContext } from "./authContext/ThemeContext";
import Login from "./routes/Login";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Register from "./routes/RegisterPage";
import ForgotPasswordPage from "./routes/ForgotPasswordPage";




function ThemedApp() {
  const { mode } = useThemeContext();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgotPasswordPage />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  );
}


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
