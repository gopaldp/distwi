import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../authContext/AuthContext";

const Register = () => {
  const navigate = useNavigate();
    const { login } = useAuth(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/register", {
       username,password })

      await login(username, password);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Typography variant="h5" mb={2}>
          Create a new account
        </Typography>

        <Paper elevation={3} sx={{ width: "100%", padding: 3 }}>
          <TextField
            size="small"
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            type="password"
            size="small"
            fullWidth
            label="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            sx={{
              backgroundColor: "#f39100",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              mt: 2,
              '&:hover': { backgroundColor: "#f9c825" },
            }}
          >
            Register
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
