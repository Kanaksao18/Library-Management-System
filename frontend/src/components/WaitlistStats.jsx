import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Chip, Stack, CircularProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import api from '../api/api';

const WaitlistStats = () => {
  const [stats, setStats] = useState({
    totalWaitlists: 0,
    vipMembers: 0,
    premiumMembers: 0,
    standardMembers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWaitlistStats();
  }, []);

  const loadWaitlistStats = async () => {
    try {
      setLoading(true);
      // Get all books and their waitlists
      const booksResponse = await api.get('/books');
      const books = booksResponse.data;
      
      let totalWaitlists = 0;
      let vipMembers = 0;
      let premiumMembers = 0;
      let standardMembers = 0;

      // For each book, get its waitlist
      for (const book of books) {
        try {
          const waitlistResponse = await api.get(`/waitlist/book/${book.id}`);
          const waitlist = waitlistResponse.data;
          
          totalWaitlists += waitlist.length;
          
          waitlist.forEach(entry => {
            if (entry.priority >= 100) {
              vipMembers++;
            } else if (entry.priority >= 50) {
              premiumMembers++;
            } else {
              standardMembers++;
            }
          });
        } catch (err) {
          // Book might not have waitlist
          console.log(`No waitlist for book ${book.id}`);
        }
      }

      setStats({
        totalWaitlists,
        vipMembers,
        premiumMembers,
        standardMembers
      });
    } catch (err) {
      console.error('Failed to load waitlist stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', textAlign: 'center' }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: '#374151' }}>Loading waitlist stats...</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleIcon sx={{ color: '#f59e0b', fontSize: 32, mr: 1 }} />
        <Typography variant="h6" fontWeight={700} sx={{ color: '#1a223f' }}>
          Waitlist Statistics
        </Typography>
      </Box>
      
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            Total Waitlist Entries
          </Typography>
          <Chip 
            label={stats.totalWaitlists} 
            sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 700 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            VIP Members
          </Typography>
          <Chip 
            icon={<PriorityHighIcon />}
            label={stats.vipMembers} 
            sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 700 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            Premium Members
          </Typography>
          <Chip 
            label={stats.premiumMembers} 
            sx={{ bgcolor: '#fef3c7', color: '#f59e0b', fontWeight: 700 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ color: '#374151' }}>
            Standard Members
          </Typography>
          <Chip 
            label={stats.standardMembers} 
            sx={{ bgcolor: '#dcfce7', color: '#059669', fontWeight: 700 }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default WaitlistStats; 