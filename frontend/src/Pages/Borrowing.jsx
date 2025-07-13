import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Box, Typography, Paper, Stack, Button, Grid, TextField, Chip, Tabs, Tab, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import WaitlistModal from "../components/WaitlistModal";
import JoinWaitlistModal from "../components/JoinWaitlistModal";

const statusChip = (status) => {
  if (status === "AVAILABLE") {
    return <Chip icon={<CheckCircleIcon sx={{ color: "#059669" }} />} label="Available" sx={{ bgcolor: "#dcfce7", color: "#059669", fontWeight: 700, px: 1.5 }} />;
  }
  if (status === "BORROWED") {
    return <Chip icon={<PendingIcon sx={{ color: "#f59e0b" }} />} label="Borrowed" sx={{ bgcolor: "#fef3c7", color: "#d97706", fontWeight: 700, px: 1.5 }} />;
  }
  return null;
};

const Borrowing = () => {
  const [tab, setTab] = useState(0);
  const [allBooks, setAllBooks] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [returns, setReturns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [joinWaitlistModalOpen, setJoinWaitlistModalOpen] = useState(false);

  const loadAllBooks = () => {
    api.get("/books").then(res => setAllBooks(res.data));
  };

  const loadBorrowedBooks = () => {
    api.get("/borrowing/borrowed").then(res => setBorrowed(res.data));
  };

  const loadRecentReturns = () => {
    api.get("/borrowing/returns").then(res => setReturns(res.data));
  };

  const loadMembers = () => {
    api.get("/auth/users").then(res => {
      setMembers(res.data.filter(user => user.role === 'USER'));
    });
  };

  useEffect(() => {
    loadAllBooks();
    loadBorrowedBooks();
    loadRecentReturns();
    loadMembers();
  }, []);

  const handleStatusChange = async () => {
    if (!selectedBook || !selectedStatus) return;

    setLoading(true);
    try {
      if (selectedStatus === "BORROWED") {
        if (!selectedMember) {
          setError("Please select a member when marking as borrowed");
          return;
        }
        // Issue the book
        await api.post('/borrowing/issue', {
          bookId: selectedBook.id,
          memberId: selectedMember
        });
      } else if (selectedStatus === "AVAILABLE") {
        // Find if this book is currently borrowed and return it
        const borrowedBook = borrowed.find(b => b.title === selectedBook.title);
        if (borrowedBook) {
          await api.post(`/borrowing/return/${borrowedBook.id}`);
        } else {
          // Just update the book status directly
          await api.put(`/books/${selectedBook.id}`, {
            ...selectedBook,
            status: selectedStatus
          });
        }
      }
      
      loadAllBooks();
      loadBorrowedBooks();
      loadRecentReturns();
      setStatusModalOpen(false);
      setSelectedBook(null);
      setSelectedStatus("");
      setSelectedMember("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update book status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId) => {
    setLoading(true);
    try {
      await api.post(`/borrowing/return/${borrowId}`);
      loadBorrowedBooks();
      loadRecentReturns();
      loadAllBooks();
    } catch (err) {
      setError("Failed to return book");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (book) => {
    setSelectedBook(book);
    setSelectedStatus(book.status);
    setSelectedMember("");
    setStatusModalOpen(true);
  };

  const filtered = allBooks.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#fff8e1', minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h3" fontWeight={800} sx={{ color: '#1a223f', mb: 3 }}>Book Management</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={0} sx={{ display: 'flex', mb: 2, borderRadius: 2, overflow: 'hidden', bgcolor: '#f8fafc' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flex: 1 }}>
            <Tab label="All Books" sx={{ fontWeight: 700, fontSize: 16 }} />
            <Tab label="Borrowed Books" sx={{ fontWeight: 700, fontSize: 16 }} />
            <Tab label="Recent Returns" sx={{ fontWeight: 700, fontSize: 16 }} />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <>
            <TextField
              fullWidth
              placeholder="Search by book title or author..."
              variant="outlined"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2 }}
            />
            <Stack spacing={3}>
              {filtered.map(book => (
                <Paper key={book.id} elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <MenuBookIcon sx={{ color: "#b45309", fontSize: 36 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#1a223f' }}>{book.title}</Typography>
                      <Typography variant="body2" sx={{ color: '#374151' }}>by {book.author}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {statusChip(book.status)}
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setSelectedBook(book);
                          setWaitlistModalOpen(true);
                        }}
                        sx={{ 
                          borderColor: "#f59e0b", 
                          color: "#f59e0b", 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          px: 2, 
                          py: 1,
                          '&:hover': { 
                            borderColor: "#d97706", 
                            bgcolor: "#fef3c7" 
                          } 
                        }}
                      >
                        View Waitlist
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => {
                          setSelectedBook(book);
                          setJoinWaitlistModalOpen(true);
                        }}
                        sx={{ 
                          borderColor: "#059669", 
                          color: "#059669", 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          px: 2, 
                          py: 1,
                          '&:hover': { 
                            borderColor: "#047857", 
                            bgcolor: "#f0fdf4" 
                          } 
                        }}
                      >
                        Join Waitlist
                      </Button>
                      <Button 
                        variant="outlined" 
                        onClick={() => openStatusModal(book)}
                        sx={{ 
                          borderColor: "#059669", 
                          color: "#059669", 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          px: 3, 
                          py: 1,
                          '&:hover': { 
                            borderColor: "#047857", 
                            bgcolor: "#f0fdf4" 
                          } 
                        }}
                      >
                        Manage Status
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        {tab === 1 && (
          <>
            <TextField
              fullWidth
              placeholder="Search by book title, member name, or ID..."
              variant="outlined"
              value={search}
              onChange={e => setSearch(e.target.value)}
              sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2 }}
            />
            <Stack spacing={3}>
              {borrowed.filter(b =>
                b.title.toLowerCase().includes(search.toLowerCase()) ||
                b.memberName.toLowerCase().includes(search.toLowerCase()) ||
                b.memberId.toLowerCase().includes(search.toLowerCase())
              ).map(b => (
                <Paper key={b.id} elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <MenuBookIcon sx={{ color: "#b45309", fontSize: 36 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#1a223f' }}>{b.title}</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonIcon sx={{ color: "#a3a3a3", fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>{b.memberName} (ID: {b.memberId})</Typography>
                        <CalendarMonthIcon sx={{ color: "#a3a3a3", fontSize: 20, ml: 2 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>Due: {new Date(b.dueDate).toLocaleDateString()}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {statusChip(b.status)}
                    <Box>
                      <Typography variant="caption" sx={{ color: '#a3a3a3', display: 'block', textAlign: 'right' }}>
                        Issued: {new Date(b.issuedDate).toLocaleDateString()}
                      </Typography>
                      <Button 
                        variant="contained" 
                        disabled={loading}
                        onClick={() => handleReturnBook(b.id)}
                        sx={{ bgcolor: "#059669", color: "#fff", fontWeight: 700, borderRadius: 2, px: 3, py: 1, mt: 1, '&:hover': { bgcolor: "#047857" } }}
                      >
                        {loading ? 'Returning...' : 'Return Book'}
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </>
        )}

        {tab === 2 && (
          <Stack spacing={3}>
            {returns.map(b => (
              <Paper key={b.id} elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <MenuBookIcon sx={{ color: "#059669", fontSize: 36 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#1a223f' }}>{b.title}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PersonIcon sx={{ color: "#a3a3a3", fontSize: 20 }} />
                      <Typography variant="body2" sx={{ color: '#374151' }}>{b.memberName} (ID: {b.memberId})</Typography>
                      <CalendarMonthIcon sx={{ color: "#a3a3a3", fontSize: 20, ml: 2 }} />
                      <Typography variant="body2" sx={{ color: '#374151' }}>Returned: {new Date(b.returnedDate).toLocaleDateString()}</Typography>
                    </Stack>
                  </Box>
                </Stack>
                <Chip 
                  label="Returned" 
                  sx={{ bgcolor: "#dcfce7", color: "#059669", fontWeight: 700, px: 1.5 }} 
                />
              </Paper>
            ))}
          </Stack>
        )}

        {/* Status Management Modal */}
        <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700 }}>
            Manage Book Status
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {selectedBook && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#1a223f' }}>
                    {selectedBook.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    by {selectedBook.author}
                  </Typography>
                </Box>
              )}
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Book Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Book Status"
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="BORROWED">Borrowed</MenuItem>
                </Select>
              </FormControl>

              {selectedStatus === "BORROWED" && (
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
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusChange} 
              variant="contained" 
              disabled={loading || !selectedStatus || (selectedStatus === "BORROWED" && !selectedMember)}
              sx={{ bgcolor: "#059669", '&:hover': { bgcolor: "#047857" } }}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Waitlist Modal */}
        <WaitlistModal
          open={waitlistModalOpen}
          onClose={() => setWaitlistModalOpen(false)}
          bookId={selectedBook?.id}
          bookTitle={selectedBook?.title}
        />

        {/* Join Waitlist Modal */}
        <JoinWaitlistModal
          open={joinWaitlistModalOpen}
          onClose={() => setJoinWaitlistModalOpen(false)}
          bookId={selectedBook?.id}
          bookTitle={selectedBook?.title}
          onSuccess={() => {
            // Refresh waitlist data if needed
            console.log('Successfully joined waitlist');
          }}
        />
      </Box>
    </Box>
  );
};

export default Borrowing;
