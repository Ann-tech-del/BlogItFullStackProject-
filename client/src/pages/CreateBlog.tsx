import React, { useState } from 'react'
import LayOut from '../components/LayOut'
import { Stack, TextField, Typography, Paper, Button, Box, Alert, CircularProgress } from '@mui/material'
import axiosInstance from '../api/axios'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

interface BlogData {
  title: string;
  synopsis: string;
  content: string;
  imageUrl?: string;
}

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [synopsis, setSynopsis] = useState("")
  const [content, setContent] = useState('')
  const [fileInputState, setFileInputState] = useState('')
  const [previewSource, setPreviewSource] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("")

  const navigate = useNavigate();

  const uploadImageMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "blogimages");
      formData.append("cloud_name", "dofekmtxb");

      const res = await axiosInstance.post(
        "https://api.cloudinary.com/v1_1/dofekmtxb/image/upload",
        formData
      );
      return res.data;
    },
    onError: (error) => {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    }
  });

  const createBlogMutation = useMutation({
    mutationFn: async (blogData: BlogData) => {
      const response = await axiosInstance.post('/api/blogs', blogData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Blog created successfully:', data);
      setTitle("");
      setSynopsis("");
      setContent("");
      setFileInputState("");
      setPreviewSource("");
      setSelectedFile(null);
      setError("");
      navigate('/dashBoard')
    },
    onError: (error) => {
      setError('Failed to create blog. Please try again.');
      console.error('Blog creation error:', error);
    }
  });

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      setFileInputState(e.target.value);
      setError("");
      previewFile(file);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPreviewSource(reader.result);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!synopsis.trim()) {
      setError('Synopsis is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }
    try {
      let imageUrl = "";
      if (selectedFile) {
        const uploadResult = await uploadImageMutation.mutateAsync(selectedFile);
        imageUrl = uploadResult.secure_url || uploadResult.url || uploadResult.imageUrl || "";
      }
      const blogData: BlogData = {
        title: title.trim(),
        synopsis: synopsis.trim(),
        content: content.trim(),
        ...(imageUrl && { imageUrl })
      };
      await createBlogMutation.mutateAsync(blogData);
    } catch (error) {
    }
  };

  const isLoading = uploadImageMutation.isPending || createBlogMutation.isPending;

  return (
    <Box bgcolor={'#F3F2E7'} minHeight="100vh">
      <LayOut>
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Typography variant='h2' sx={{ alignSelf: 'center', mb: 3 }}>
            Create Your Blog
          </Typography>
          <Paper elevation={6} sx={{ p: 5, width: '50%', maxWidth: '600px' }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Blog Image (Optional)
                  </Typography>
                  <input
                    type='file'
                    accept="image/*"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    style={{ marginBottom: '10px' }}
                  />
                  {previewSource && (
                    <Box sx={{ mt: 2 }}>
                      <img 
                        src={previewSource} 
                        alt="Blog preview" 
                        style={{ 
                          height: '200px', 
                          width: 'auto', 
                          maxWidth: '100%',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }} 
                      />
                    </Box>
                  )}
                </Box>
                <TextField
                  label='Title'
                  type='text'
                  variant='filled'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label='Synopsis'
                  type='text'
                  variant='filled'
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  required
                  fullWidth
                  multiline
                  rows={2}
                />
                <TextField
                  label="Content"
                  multiline
                  rows={6}
                  variant='filled'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  fullWidth
                />
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={isLoading}
                  sx={{ mt: 2 }}
                >
                  {isLoading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={20} color="inherit" />
                      <span>Creating Blog...</span>
                    </Stack>
                  ) : (
                    'Create Blog'
                  )}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </LayOut>
    </Box>
  )
}

export default CreateBlog