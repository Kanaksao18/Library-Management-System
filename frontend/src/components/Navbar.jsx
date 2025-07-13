import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Stack, Divider } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BarChartIcon from '@mui/icons-material/BarChart';

const NAV_HEIGHT = 90;
const ICON_SIZE = 32;
const ACTIVE_DASHBOARD_BG = '#d97706';
const YELLOW = '#fdc13d';
const NAV_TEXT = '#1a223f';
const WELCOME_TEXT = '#374151';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0} sx={{
      bgcolor: '#fff',
      borderBottom: `4px solid ${YELLOW}`,
      px: 0,
      width: '100%',
      boxShadow: '0 2px 8px 0 rgba(124, 58, 237, 0.08)',
    }}>
      {/* Top Row: Logo and Welcome */}
      <Toolbar disableGutters sx={{ minHeight: 56, height: 56, px: 5, bgcolor: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MenuBookIcon sx={{ color: YELLOW, fontSize: ICON_SIZE + 8, mr: 1 }} />
          <Typography variant="h4" sx={{ color: NAV_TEXT, fontWeight: 800, letterSpacing: 1, fontSize: 32 }}>
            LibraryHub
          </Typography>
        </Box>
        {user && (
          <Typography sx={{ color: WELCOME_TEXT, fontWeight: 500, fontSize: 18 }}>
            Welcome, {user.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'User'}
          </Typography>
        )}
      </Toolbar>
      {/* Second Row: Navigation */}
      <Toolbar disableGutters sx={{ minHeight: 56, height: 56, px: 5, bgcolor: '#fff', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-start' }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
          {user && (
            <>
              <Button
                startIcon={<HomeIcon sx={{ fontSize: ICON_SIZE }} />}
                component={Link}
                to="/dashboard"
                sx={{
                  bgcolor: isActive('/dashboard') ? ACTIVE_DASHBOARD_BG : 'transparent',
                  color: isActive('/dashboard') ? '#fff' : NAV_TEXT,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: 160,
                  fontSize: 18,
                  boxShadow: isActive('/dashboard') ? 1 : 0,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: isActive('/dashboard') ? ACTIVE_DASHBOARD_BG : '#f3f4f6' }
                }}
              >
                Dashboard
              </Button>
              <Button
                startIcon={<MenuBookIcon sx={{ fontSize: ICON_SIZE }} />}
                component={Link}
                to="/"
                sx={{
                  bgcolor: isActive('/') ? ACTIVE_DASHBOARD_BG : 'transparent',
                  color: isActive('/') ? '#fff' : NAV_TEXT,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: 120,
                  fontSize: 18,
                  boxShadow: isActive('/') ? 1 : 0,
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: isActive('/') ? ACTIVE_DASHBOARD_BG : '#f3f4f6' }
                }}
              >
                Books
              </Button>
              {user.role === 'ADMIN' && (
                <>
                  <Button
                    startIcon={<PeopleIcon sx={{ fontSize: ICON_SIZE }} />}
                    component={Link}
                    to="/members"
                    sx={{
                      bgcolor: isActive('/members') ? ACTIVE_DASHBOARD_BG : 'transparent',
                      color: isActive('/members') ? '#fff' : NAV_TEXT,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      minWidth: 140,
                      fontSize: 18,
                      boxShadow: isActive('/members') ? 1 : 0,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: isActive('/members') ? ACTIVE_DASHBOARD_BG : '#f3f4f6' }
                    }}
                  >
                    Members
                  </Button>
                  <Button
                    startIcon={<SwapHorizIcon sx={{ fontSize: ICON_SIZE }} />}
                    component={Link}
                    to="/borrowing"
                    sx={{
                      bgcolor: isActive('/borrowing') ? ACTIVE_DASHBOARD_BG : 'transparent',
                      color: isActive('/borrowing') ? '#fff' : NAV_TEXT,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      minWidth: 160,
                      fontSize: 18,
                      boxShadow: isActive('/borrowing') ? 1 : 0,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: isActive('/borrowing') ? ACTIVE_DASHBOARD_BG : '#f3f4f6' }
                    }}
                  >
                    Borrowing
                  </Button>
                  <Button
                    startIcon={<BarChartIcon sx={{ fontSize: ICON_SIZE }} />}
                    component={Link}
                    to="/reports"
                    sx={{
                      bgcolor: isActive('/reports') ? ACTIVE_DASHBOARD_BG : 'transparent',
                      color: isActive('/reports') ? '#fff' : NAV_TEXT,
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      minWidth: 140,
                      fontSize: 18,
                      boxShadow: isActive('/reports') ? 1 : 0,
                      transition: 'background 0.2s',
                      '&:hover': { bgcolor: isActive('/reports') ? ACTIVE_DASHBOARD_BG : '#f3f4f6' }
                    }}
                  >
                    Reports
                  </Button>
                </>
              )}
              <Button
                color="inherit"
                onClick={() => { logout(); navigate("/login"); }}
                sx={{ color: ACTIVE_DASHBOARD_BG, fontWeight: 700, fontSize: 18, px: 3, py: 1.5, borderRadius: 2 }}
              >
                Logout
              </Button>
            </>
          )}
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ color: NAV_TEXT, fontWeight: 700, fontSize: 18, px: 3, py: 1.5, borderRadius: 2 }}>Login</Button>
              <Button color="inherit" component={Link} to="/register" sx={{ color: NAV_TEXT, fontWeight: 700, fontSize: 18, px: 3, py: 1.5, borderRadius: 2 }}>Register</Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
