import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, FormControl, InputLabel, Select, MenuItem, Alert, Box, Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api/api';

const EditMemberModal = ({ open, onClose, member, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    memberType: 'STANDARD',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member && open) {
      setFormData({
        username: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        memberType: member.memberType || 'STANDARD',
        status: member.status || 'ACTIVE'
      });
    }
  }, [member, open]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/auth/users/${member.id}`, {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        memberType: formData.memberType,
        status: formData.status
      });
      
      onSuccess?.();
      onClose();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1a223f' }}>
        Edit Member
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Name"
            value={formData.username}
            onChange={handleChange('username')}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            sx={{ mb: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={handleChange('phone')}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Member Type</InputLabel>
            <Select
              value={formData.memberType}
              onChange={handleChange('memberType')}
              label="Member Type"
            >
              <MenuItem value="STANDARD">Standard</MenuItem>
              <MenuItem value="PREMIUM">Premium</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleChange('status')}
              label="Status"
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !formData.username || !formData.email}
          sx={{ bgcolor: "#059669", '&:hover': { bgcolor: "#047857" } }}
        >
          {loading ? 'Updating...' : 'Update Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMemberModal; 