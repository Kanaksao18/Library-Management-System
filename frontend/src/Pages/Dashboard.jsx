import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Box, Grid, Paper, Typography, Button, Stack, Avatar, Divider
} from "@mui/material";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import TodayIcon from '@mui/icons-material/Today';
import WaitlistStats from "../components/WaitlistStats";

const statCards = [
  {
    label: "Total Books",
    icon: <MenuBookIcon sx={{ color: '#059669', fontSize: 32 }} />,
    iconBg: '#e0edff',
    key: 'totalBooks',
  },
  {
    label: "Active Members",
    icon: <PeopleIcon sx={{ color: '#22c55e', fontSize: 32 }} />,
    iconBg: '#e6f9ef',
    key: 'activeMembers',
  },
  {
    label: "Books Borrowed",
    icon: <SwapHorizIcon sx={{ color: '#ea580c', fontSize: 32 }} />,
    iconBg: '#fff7e6',
    key: 'booksBorrowed',
  },
  {
    label: "Overdue Books",
    icon: <ErrorOutlineIcon sx={{ color: '#f87171', fontSize: 32 }} />,
    iconBg: '#ffeaea',
    key: 'overdueBooks',
  },
];

const quickActions = [
  {
    label: "Add New Book",
    icon: <MenuBookIcon />,
    color: "#059669",
    to: "/add-book"
  },
  {
    label: "Register Member",
    icon: <PersonAddIcon />,
    color: "#22c55e",
    to: "/register"
  },
  {
    label: "Issue Book",
    icon: <SwapHorizIcon />,
    color: "#ea580c",
    to: "/borrowing"
  },
  {
    label: "View Reports",
    icon: <BarChartIcon />,
    color: "#059669",
    to: "/reports"
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then(res => setStats(res.data));
    api.get("/dashboard/activity").then(res => setActivity(res.data));
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff8e1', minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h3" fontWeight={800} sx={{ color: '#1a223f' }}>Dashboard</Typography>
          <Button variant="outlined" startIcon={<TodayIcon />} sx={{ borderRadius: 2, fontWeight: 600, bgcolor: '#fff', color: '#1a223f', borderColor: '#e5e7eb', boxShadow: 0, px: 3, py: 1 }}>
            Today
          </Button>
        </Stack>
        <Grid container spacing={3} mb={3}>
          {statCards.map(card => (
            <Grid item xs={12} sm={6} md={3} key={card.label}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                <Avatar sx={{ bgcolor: card.iconBg, width: 56, height: 56 }}>{card.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ color: '#374151', fontWeight: 600 }}>{card.label}</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#1a223f' }}>{stats[card.key] ?? '--'}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 3, minHeight: 400, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
              <Typography variant="h5" fontWeight={700} mb={1} sx={{ color: '#1a223f' }}>
                <span style={{ color: '#ea580c', marginRight: 8, fontSize: 22 }}>●</span>Recent Activity
              </Typography>
              <Typography variant="body2" sx={{ color: '#374151', mb: 2 }}>Latest library activities and updates</Typography>
              <Divider sx={{ mb: 2 }} />
              {activity.length === 0 && <Typography sx={{ color: '#374151' }}>No recent activity.</Typography>}
              <Stack spacing={3}>
                {activity.map((item, idx) => (
                  <Box key={idx}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span style={{ color: '#ea580c', fontSize: 18 }}>●</span>
                      <Typography fontWeight={700} sx={{ color: '#1a223f' }}>{item.title}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: '#374151' }}>{item.description}</Typography>
                    <Typography variant="caption" sx={{ color: '#374151' }}>{item.time}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, minHeight: 140, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}>
                <Typography variant="h5" fontWeight={700} mb={1} sx={{ color: '#1a223f' }}>Quick Actions</Typography>
                <Typography variant="body2" sx={{ color: '#374151', mb: 2 }}>Frequently used library functions</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {quickActions.map((action, idx) => (
                    <Button
                      key={action.label}
                      fullWidth
                      variant="contained"
                      startIcon={action.icon}
                      sx={{
                        bgcolor: action.color,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18,
                        borderRadius: 2,
                        py: 2.2,
                        boxShadow: 0,
                        minHeight: 64,
                        maxWidth: { sm: 180, md: 200 },
                        '&:hover': { bgcolor: action.color }
                      }}
                      onClick={() => window.location.href = action.to}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </Paper>
              
              <WaitlistStats />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
