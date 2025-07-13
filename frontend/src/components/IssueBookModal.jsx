import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  FormControl, InputLabel, Select, MenuItem, Box, Typography, Alert
} from '@mui/material';
import api from '../api/api';

const IssueBookModal = ({ open, onClose, onSuccess }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      // Load available books
      api.get('/books').then(res => {
        setBooks(res.data.filter(book => book.available));
      }).catch(err => {
        console.error('Error loading books:', err);
      });

      // Load members (users)
      api.get('/auth/users').then(res => {
        setMembers(res.data.filter(user => user.role === 'USER'));
      }).catch(err => {
        console.error('Error loading members:', err);
      });
    }
  }, [open]);

  const handleIssue = async () => {
    if (!selectedBook || !selectedMember) {
      setError('Please select both a book and a member');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/borrowing/issue', {
        bookId: selectedBook,
        memberId: selectedMember
      });
      
      onSuccess();
      onClose();
      setSelectedBook('');
      setSelectedMember('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>Issue Book</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Book</InputLabel>
            <Select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              label="Select Book"
            >
              {books.map((book) => (
                <MenuItem key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              label="Select Member"
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.username} (ID: {member.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleIssue} 
          variant="contained" 
          disabled={loading || !selectedBook || !selectedMember}
          sx={{ bgcolor: "#059669", '&:hover': { bgcolor: "#047857" } }}
        >
          {loading ? 'Issuing...' : 'Issue Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueBookModal; 