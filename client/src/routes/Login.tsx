import React, { useState } from "react";
import { useAuth } from "../authContext/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Register from './RegisterPage';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";

const Login = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(username, password);
  };

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

const regsiterUser = async ( ) =>{
  navigate('/register');
}
const handleForgetPassword = async ( ) =>{
  navigate('/forgetPassword');
}

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        {/* Logos */}
        <Box mb={2} display="flex" gap={2} alignItems="center">
          <img src="/images/Logo1.png" alt="Logo 1" height={40} />
          <Box textAlign="center" mt={1}>
    <Typography style={{height:"20px"}} lineHeight={1}>
      Bauhaus
    </Typography>
    <Typography style={{height:"20px", fontFamily:"sans-serif",fontWeight:"bold"}}  lineHeight={1}>
      EnergyHub
    </Typography>
  </Box>
        </Box>

        <Typography variant="h5" mb={2}>
          Sign in to Bauhaus EnergyHub
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", padding: 3 }}>
          <Box mb={2}>
            <Typography
              variant="body2"
              fontWeight={500}
              mb={0.5}
            >
              Userame or email adress
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>

          <Box mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" fontWeight={500}>
                Password
              </Typography>
              <Typography
                onClick={handleForgetPassword}
                variant="body2"
                sx={{ color: "#d18e2f", fontSize: "0.8rem", cursor: "pointer" }}
              >
                Forgot password?
              </Typography>
            </Box>
            <TextField
              type="password"
              size="small"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#f39100",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              mt: 1,
              '&:hover': {
                backgroundColor: "#f9c825",
              },
            }}
          >
            Sign in
          </Button>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            width: "100%",
            mt: 2,
            p: 1.5,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography variant="body2">
            New to Bauhaus EnergyHub?{" "}
            <Link
  component="button"
  onClick={() => regsiterUser()}
  underline="hover"
  sx={{ color: "#d18e2f", fontWeight: 500 }}
>
  Create an account
</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
