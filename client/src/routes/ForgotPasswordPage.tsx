import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage  = () => {
  const navigate= useNavigate();
  const [username, setUsername] = useState<string>("");
  const [usernameVerified, setUsernameVerified] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const verifyUsername = async () => {
    try {
      const response = await axios.post("http://localhost:8000/forgot-password", {
        username,
        old_password: "",
        new_password: "", 
      });
    } catch (err: any) {
      if (err.response?.status === 404) {
        setMessage({ type: "error", text: "User does not exist" });
        return;
      }
    }
    setUsernameVerified(true);
    setMessage(null);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      await axios.post("http://localhost:8000/forgot-password", {
        username,
        old_password: "",
        new_password: newPassword,
      });
      setMessage({ type: "success", text: "Password reset successfully!" });
      setUsername("");
      setNewPassword("");
      setConfirmPassword("");
      setUsernameVerified(false);
       setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.detail || "Something went wrong",
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <Typography variant="h5" mb={2}>
          Forgot Password
        </Typography>
        <Paper elevation={3} sx={{ width: "100%", padding: 3 }}>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          {!usernameVerified ? (
            <>
              <TextField
                label="Enter Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={verifyUsername}
                sx={{ mt: 2, backgroundColor: "#f39100" }}
              >
                Verify Username
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleResetPassword}
                sx={{ mt: 2, backgroundColor: "#f39100" }}
              >
                Reset Password
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
