import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, List, ListItem, ListItemText, Chip, Box, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import api from '../api/api';

const WaitlistModal = ({ open, onClose, bookId, bookTitle }) => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && bookId) {
      loadWaitlist();
    }
  }, [open, bookId]);

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/waitlist/book/${bookId}`);
      setWaitlist(response.data);
    } catch (err) {
      setError('Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 100) return '#dc2626'; // High priority - red
    if (priority >= 50) return '#f59e0b';  // Medium priority - orange
    return '#059669'; // Low priority - green
  };

  const getPriorityLabel = (priority) => {
    if (priority >= 100) return 'VIP';
    if (priority >= 50) return 'Premium';
    return 'Standard';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1a223f' }}>
        Waitlist for "{bookTitle}"
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Typography>Loading waitlist...</Typography>
        ) : waitlist.length === 0 ? (
          <Typography sx={{ color: '#374151', textAlign: 'center', py: 3 }}>
            No one is currently on the waitlist for this book.
          </Typography>
        ) : (
          <List>
            {waitlist.map((entry, index) => (
              <ListItem key={entry.id} sx={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 2, 
                mb: 1,
                bgcolor: '#fff'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <PersonIcon sx={{ color: '#6b7280', mr: 1 }} />
                    <ListItemText
                      primary={entry.user?.username || 'Unknown User'}
                      secondary={`Position: ${index + 1} • Joined: ${new Date(entry.createdAt).toLocaleDateString()}`}
                    />
                  </Box>
                  <Chip
                    icon={<PriorityHighIcon />}
                    label={getPriorityLabel(entry.priority)}
                    sx={{
                      bgcolor: getPriorityColor(entry.priority),
                      color: '#fff',
                      fontWeight: 700
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#374151' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WaitlistModal; 