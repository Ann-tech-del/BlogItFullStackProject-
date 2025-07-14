import _React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  Avatar,
  useTheme,
  Skeleton
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaBlog } from "react-icons/fa6";
import useUserStore from '../store/userStore';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';

const Header = () => {
  const { user, logoutUser } = useUserStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const [hydrated, setHydrated] = useState(false);

  
  useEffect(() => {
    setHydrated(true);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/api/auth/logout');
      return response.data;
    },
    onSuccess: () => {
      logoutUser();
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      logoutUser();
      navigate('/');
    }
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AppBar
      position="static"
      component="nav"
      sx={{ bgcolor: theme.palette.secondary.main }}
    >
      <Toolbar>
        <IconButton size="large" edge="start" sx={{ color: theme.palette.text.primary }}>
          <FaBlog />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            textTransform: 'uppercase',
            flexGrow: 1,
            color: theme.palette.text.primary,
            fontWeight: theme.typography.h2.fontWeight
          }}
        >
          BlogIt
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          {!hydrated ? (
            <>
              <Skeleton variant="rectangular" width={80} height={32} />
              <Skeleton variant="rectangular" width={80} height={32} />
              <Skeleton variant="rectangular" width={80} height={32} />
            </>
          ) : user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/dashboard"
                sx={{ fontSize: '1rem', color: theme.palette.text.primary }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                sx={{ fontSize: '1rem', color: theme.palette.text.primary }}
              >
                Profile
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/Createblog"
                sx={{ fontSize: '1rem', color: theme.palette.text.primary }}
              >
                Create Blog
              </Button>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                welcome {user.firstName}
              </Typography>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.text.primary,
                }}
              >
                {user.firstName?.[0]?.toUpperCase()}
                {user.lastName?.[0]?.toUpperCase()}
              </Avatar>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                sx={{ fontSize: '1rem' }}
              >
                {logoutMutation.isPending ? 'Logging Out...' : 'Log Out'}
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ fontSize: '1rem', color: theme.palette.text.primary }}
              >
                Home
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/login"
                sx={{ fontSize: '1rem' }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/signup"
                sx={{ fontSize: '1rem' }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
