import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Box, Grid, Paper, Typography, Button, Stack, Avatar, Chip, TextField, IconButton, Alert
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditMemberModal from "../components/EditMemberModal";
import DeleteMemberModal from "../components/DeleteMemberModal";

const statusColors = {
  ACTIVE: "#22c55e",
  SUSPENDED: "#f87171"
};
const typeColors = {
  PREMIUM: "#a3a3f3",
  STANDARD: "#a3bffa",
  STUDENT: "#6ee7b7"
};

const Members = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    api.get("/dashboard/members").then(res => setMembers(res.data));
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const handleDeleteMember = (member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    loadMembers();
    setError("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;

    setLoading(true);
    try {
      await api.delete(`/auth/users/${selectedMember.id}`);
      loadMembers();
      setDeleteModalOpen(false);
      setSelectedMember(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete member");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#fff8e1', minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#1a223f' }}>Member Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#22c55e', fontWeight: 700, fontSize: 18, borderRadius: 2, px: 3, py: 1.5, boxShadow: 0, '&:hover': { bgcolor: '#16a34a' } }}>
            Add New Member
          </Button>
        </Stack>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          placeholder="Search members by name, email, or phone..."
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2 }}
        />
        <Grid container spacing={3}>
          {filtered.map(member => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                  <Avatar sx={{ bgcolor: '#fde68a', color: '#b45309', width: 56, height: 56 }}>
                    <PersonIcon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#1a223f' }}>{member.name}</Typography>
                    <Typography variant="body2" sx={{ color: '#374151' }}>Member ID: {member.memberId}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip label={member.status.charAt(0) + member.status.slice(1).toLowerCase()} size="small" sx={{ bgcolor: statusColors[member.status], color: '#fff', fontWeight: 700 }} />
                    <Chip label={member.memberType.charAt(0) + member.memberType.slice(1).toLowerCase()} size="small" sx={{ bgcolor: typeColors[member.memberType], color: '#374151', fontWeight: 700 }} />
                  </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <EmailIcon sx={{ color: '#a3a3a3', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#374151' }}>{member.email}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <PhoneIcon sx={{ color: '#a3a3a3', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#374151' }}>{member.phone}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <CalendarMonthIcon sx={{ color: '#a3a3a3', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#374151' }}>Joined: {member.joinDate}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#059669', display: 'inline', mr: 0.5 }}>{member.booksIssued}</Typography>
                    <Typography variant="body2" sx={{ color: '#374151', display: 'inline' }}> Books Issued</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: member.overdue > 0 ? '#f87171' : '#22c55e', display: 'inline', mr: 0.5 }}>{member.overdue}</Typography>
                    <Typography variant="body2" sx={{ color: '#374151', display: 'inline' }}> Overdue</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />} 
                    onClick={() => handleEditMember(member)}
                    sx={{ color: '#1a223f', borderColor: '#e5e7eb', fontWeight: 700, borderRadius: 2, px: 2, '&:hover': { borderColor: '#059669', bgcolor: '#f0fdf4' } }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => handleDeleteMember(member)}
                    sx={{ color: '#f87171', borderColor: '#f87171', fontWeight: 700, borderRadius: 2, px: 2, '&:hover': { bgcolor: '#fef2f2', borderColor: '#f87171' } }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Edit Member Modal */}
      <EditMemberModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        member={selectedMember}
        onSuccess={handleUpdateSuccess}
      />

      {/* Delete Member Modal */}
      <DeleteMemberModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        member={selectedMember}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </Box>
  );
};

export default Members;