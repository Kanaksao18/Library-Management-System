import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { username, password, role,email,phone });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField 
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
        label="Phone"
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        fullWidth
        margin="normal"
        />

        <TextField
          select
          label="Role"
          value={role}
          onChange={e => setRole(e.target.value)}
          fullWidth
          margin="normal"
        >
        
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register; 