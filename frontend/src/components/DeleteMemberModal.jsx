import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Alert, Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';

const DeleteMemberModal = ({ open, onClose, member, onConfirm, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#1a223f' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon sx={{ color: '#f87171' }} />
          Confirm Member Removal
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The member will be permanently removed from the system.
          </Alert>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PersonIcon sx={{ color: '#6b7280', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#1a223f' }}>
                {member?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Member ID: {member?.memberId}
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151' }}>
                Email: {member?.email}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: '#374151' }}>
            Are you sure you want to remove this member? This will:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <Typography component="li" variant="body2" sx={{ color: '#374151' }}>
              Delete their account permanently
            </Typography>
            <Typography component="li" variant="body2" sx={{ color: '#374151' }}>
              Remove them from all waitlists
            </Typography>
            <Typography component="li" variant="body2" sx={{ color: '#374151' }}>
              Cancel any active book borrowings
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          disabled={loading}
          sx={{ bgcolor: "#f87171", '&:hover': { bgcolor: "#dc2626" } }}
        >
          {loading ? 'Removing...' : 'Remove Member'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMemberModal; 