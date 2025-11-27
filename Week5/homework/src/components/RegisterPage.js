import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function RegisterPage() {
  const { loginError, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    register(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            marginBottom: 2,
            height: 200,
            width: 200,
          }}
          alt="UT Longhorn"
          src="/longhorn.jpg"
        ></Box>
        <Typography component="h1" variant="h4" fontWeight="bold">
          Register
        </Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            type="email"
            InputLabelProps={{ shrink: true }}
            placeholder="user@example.com"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            InputLabelProps={{ shrink: true }}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Box>
        
        {loginError && (
          <Alert severity="error">
            {loginError}
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default RegisterPage;