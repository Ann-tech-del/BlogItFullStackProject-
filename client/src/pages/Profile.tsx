
import React, { useState, useEffect } from 'react'
import LayOut from '../components/LayOut'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axios'
import { useUserStore } from '../store/userStore'
import { Visibility, VisibilityOff, Edit, Save, Cancel } from '@mui/icons-material'
import { Grid } from '@mui/material'

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  dateJoined: string;
  lastUpdate: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');


  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const response = await axiosInstance.get('/api/auth/profile');
      return response.data;
    },
    enabled: !!user
  });

  
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await axiosInstance.put('/api/auth/profile', data);
      return response.data;
    },
    onSuccess: (updatedProfile) => {
      setProfileSuccess('Profile updated successfully!');
      setProfileError('');
      setIsEditing(false);
      
    
      setUser({
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        email: updatedProfile.email,
        username: updatedProfile.username
      });
      
      
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      
      setTimeout(() => setProfileSuccess(''), 3000);
    },
    onError: (error: any) => {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
      setProfileSuccess('');
    }
  });

  
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await axiosInstance.put('/api/auth/password', data);
      return response.data;
    },
    onSuccess: () => {
      setPasswordError('');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswords({ current: false, new: false, confirm: false });
      alert('Password updated successfully!');
    },
    onError: (error: any) => {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    }
  });

  
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        username: profile.username
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileError('');
    setProfileSuccess('');
    
    if (profile) {
      setProfileForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        username: profile.username
      });
    }
  };



  if (isLoading) {
    return (
      <Box bgcolor={'#F3F2E7'} minHeight="100vh">
        <LayOut>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </LayOut>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bgcolor={'#F3F2E7'} minHeight="100vh">
        <LayOut>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
              Failed to load profile. Please try again later.
            </Alert>
          </Box>
        </LayOut>
      </Box>
    );
  }

  return (
    <Box bgcolor={'#F3F2E7'} minHeight="100vh">
      <LayOut>
        <Box sx={{ p: 4 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>
            Profile Settings
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
              <Paper elevation={6} sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Profile Information
                  </Typography>
                  {!isEditing ? (
                    <IconButton 
                      onClick={() => setIsEditing(true)}
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        onClick={handleProfileSubmit}
                        color="success"
                        size="small"
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save />
                      </IconButton>
                      <IconButton 
                        onClick={handleCancelEdit}
                        color="error"
                        size="small"
                      >
                        <Cancel />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>

                {profileSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {profileSuccess}
                  </Alert>
                )}

                {profileError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {profileError}
                  </Alert>
                )}

                <form onSubmit={handleProfileSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      label="First Name"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                      required
                    />
                    
                    <TextField
                      label="Last Name"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                      required
                    />
                    
                    <TextField
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                      required
                    />
                    
                    <TextField
                      label="Username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      disabled={!isEditing}
                      fullWidth
                      required
                    />

                    {isEditing && (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={updateProfileMutation.isPending}
                        sx={{ mt: 2 }}
                      >
                        {updateProfileMutation.isPending ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CircularProgress size={20} color="inherit" />
                            <span>Updating...</span>
                          </Stack>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    )}
                  </Stack>
                </form>


              </Paper>
            </Grid>

            
            <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
              <Paper elevation={6} sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Change Password
                </Typography>

                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      label="Current Password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              edge="end"
                            >
                              {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              edge="end"
                            >
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Confirm New Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      fullWidth
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              edge="end"
                            >
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
                      size="large"
                      disabled={updatePasswordMutation.isPending}
                      sx={{ mt: 2 }}
                    >
                      {updatePasswordMutation.isPending ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={20} color="inherit" />
                          <span>Updating Password...</span>
                        </Stack>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </LayOut>
    </Box>
  )
}

export default Profile