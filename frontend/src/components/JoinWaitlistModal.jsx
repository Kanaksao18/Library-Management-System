import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, FormControl, InputLabel, Select, MenuItem, Alert, Box
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../api/api';

const JoinWaitlistModal = ({ open, onClose, bookId, bookTitle, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadMembers();
    }
  }, [open]);

  const loadMembers = async () => {
    try {
      const response = await api.get('/auth/users');
      setMembers(response.data.filter(user => user.role === 'USER'));
    } catch (err) {
      setError('Failed to load members');
    }
  };

  const handleJoinWaitlist = async () => {
    if (!selectedMember) {
      setError('Please select a member');
      return;
    }

    setLoading(true);
    try {
      await api.post('/waitlist/add', {
        bookId: bookId,
        userId: selectedMember
      });
      
      onSuccess?.();
      onClose();
      setSelectedMember('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1a223f' }}>
        Join Waitlist
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="h6" sx={{ color: '#1a223f', mb: 2 }}>
            "{bookTitle}"
          </Typography>
          
          <Typography variant="body2" sx={{ color: '#374151', mb: 3 }}>
            Join the waitlist for this book. You'll be notified when it becomes available.
            Priority is given to VIP and Premium members.
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Member</InputLabel>
            <Select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              label="Select Member"
            >
              {members.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.username} ({member.memberType || 'Standard'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ bgcolor: '#f0fdf4', p: 2, borderRadius: 2, border: '1px solid #dcfce7' }}>
            <Typography variant="body2" sx={{ color: '#059669', fontWeight: 600 }}>
              Priority System:
            </Typography>
            <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.875rem' }}>
              • VIP Members: Highest priority
              <br />
              • Premium Members: Medium priority
              <br />
              • Standard Members: Base priority
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleJoinWaitlist} 
          variant="contained" 
          disabled={loading || !selectedMember}
          startIcon={<PersonAddIcon />}
          sx={{ bgcolor: "#f59e0b", '&:hover': { bgcolor: "#d97706" } }}
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinWaitlistModal; 