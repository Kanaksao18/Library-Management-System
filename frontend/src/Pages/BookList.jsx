import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Stack } from "@mui/material";

const LIBRARY_TIMINGS = "Mon-Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const [borrowedSlot, setBorrowedSlot] = useState({});

  useEffect(() => {
    api.get("/books").then(res => setBooks(res.data));
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/borrow`, null, { params: { userId: user.userId } });
      setBorrowedSlot({ ...borrowedSlot, [bookId]: new Date().toLocaleString() });
      alert("Book borrowed! Slot reserved.");
    } catch {
      alert("Failed to borrow book");
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await api.post(`/books/${bookId}/return`, null, { params: { userId: user.userId } });
      setBorrowedSlot({ ...borrowedSlot, [bookId]: undefined });
      alert("Book returned!");
    } catch {
      alert("Failed to return book");
    }
  };

  const handleReadEBook = (book) => {
    if (book.ebookUrl) {
      window.open(book.ebookUrl, '_blank');
    } else {
      alert("E-Book not available for this title.");
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Books</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#7c3aed', fontWeight: 600 }}>{LIBRARY_TIMINGS}</Typography>
      <Grid container spacing={2}>
        {books.map(book => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2">Author: {book.author}</Typography>
                <Typography variant="body2">Status: {book.status}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {user && (
                    book.status === "AVAILABLE" ? (
                      <Button onClick={() => handleBorrow(book.id)} variant="contained">Borrow</Button>
                    ) : (
                      <Button onClick={() => handleReturn(book.id)} variant="outlined">Return</Button>
                    )
                  )}
                  <Button onClick={() => handleReadEBook(book)} variant="text" color="secondary">Read E-Book</Button>
                </Stack>
                {borrowedSlot[book.id] && (
                  <Chip label={`Slot: ${borrowedSlot[book.id]}`} color="primary" sx={{ mt: 1 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookList; 