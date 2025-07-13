import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

const AddBook = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/books", { title, author });
      alert("Book added!");
      setTitle("");
      setAuthor("");
    } catch {
      alert("Failed to add book");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return <Typography sx={{ mt: 8, textAlign: "center" }}>Only admins can add books.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Book</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Author"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Add Book
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBook;
