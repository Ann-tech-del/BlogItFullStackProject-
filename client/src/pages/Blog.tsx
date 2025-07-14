import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LayOut from '../components/LayOut'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress,
  TextField,
  Avatar,
  Chip,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../api/axios'
import { useUserStore } from '../store/userStore'
import { Edit, Save, Cancel, ArrowBack, Delete } from '@mui/icons-material'

interface Blog {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  featuredImage: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    synopsis: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const { data: blog, isLoading, error: fetchError } = useQuery({
    queryKey: ['blog', id],
    queryFn: async (): Promise<Blog> => {
      const response = await axiosInstance.get(`/api/blogs/${id}`);
      return response.data;
    },
    enabled: !!id
  });


  const updateBlogMutation = useMutation({
    mutationFn: async (data: { title: string; synopsis: string; content: string }) => {
      const response = await axiosInstance.put(`/api/blogs/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedBlog) => {
      setSuccess('Blog updated successfully!');
      setError('');
      setIsEditing(false);
      
      
      queryClient.setQueryData(['blog', id], updatedBlog);
      
      
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to update blog');
      setSuccess('');
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/api/blogs/${id}`);
    },
    onSuccess: () => {
      setSuccess('Blog deleted successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Failed to delete blog');
    }
  });

  
  useEffect(() => {
    if (blog) {
      setEditForm({
        title: blog.title,
        synopsis: blog.synopsis,
        content: blog.content
      });
    }
  }, [blog]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    updateBlogMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    
    if (blog) {
      setEditForm({
        title: blog.title,
        synopsis: blog.synopsis,
        content: blog.content
      });
    }
  };

  const isAuthor = user && blog && user.username === blog.author.username;

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/800x400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://blogitfullstackproject-backened-side.onrender.com${imagePath}`;
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

  if (fetchError || !blog) {
    return (
      <Box bgcolor={'#F3F2E7'} minHeight="100vh">
        <LayOut>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
              Blog not found or failed to load.
            </Alert>
            <Button 
              variant="contained" 
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 2 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </LayOut>
      </Box>
    );
  }

  return (
    <Box bgcolor={'#F3F2E7'} minHeight="100vh">
      <LayOut>
        <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
         
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 3 }}
          >
            Back to Dashboard
          </Button>

          <Paper elevation={6} sx={{ p: 4 }}>
           
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {isEditing ? 'Edit Blog' : blog.title}
              </Typography>
              
              {isAuthor && !isEditing && (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Blog
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this blog?')) {
                        deleteBlogMutation.mutate();
                      }
                    }}
                    disabled={deleteBlogMutation.isPending}
                  >
                    {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete Blog'}
                  </Button>
                </Stack>
              )}
              
              {isEditing && (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Save />}
                    onClick={handleEditSubmit}
                    disabled={updateBlogMutation.isPending}
                  >
                    {updateBlogMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>

           
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

           
            {blog.featuredImage && (
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <img
                  src={getImageUrl(blog.featuredImage)}
                  alt={blog.title}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            )}

          
            {isEditing ? (
              <form onSubmit={handleEditSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    fullWidth
                    required
                    variant="outlined"
                  />
                  
                  <TextField
                    label="Synopsis"
                    value={editForm.synopsis}
                    onChange={(e) => setEditForm({ ...editForm, synopsis: e.target.value })}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                  
                  <TextField
                    label="Content"
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    fullWidth
                    required
                    multiline
                    rows={12}
                    variant="outlined"
                  />
                </Stack>
              </form>
            ) : (
              <Stack spacing={4}>
               
                <Typography variant="h6" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {blog.synopsis}
                </Typography>

                
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {blog.content}
                </Typography>
              </Stack>
            )}

           
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {blog.author.firstName[0].toUpperCase()}
                    {blog.author.lastName[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {blog.author.firstName} {blog.author.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{blog.author.username}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={`Created: ${new Date(blog.createdAt).toLocaleDateString()}`}
                    variant="outlined"
                    size="small"
                  />
                  {blog.updatedAt !== blog.createdAt && (
                    <Chip
                      label={`Updated: ${new Date(blog.updatedAt).toLocaleDateString()}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </LayOut>
    </Box>
  )
}

export default Blog