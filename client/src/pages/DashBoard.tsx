import { useNavigate } from 'react-router-dom'
import LayOut from '../components/LayOut'
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Chip,
  Avatar,
  Stack,
  Skeleton,
  Alert
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../api/axios'
import { CalendarToday, Person, Visibility } from '@mui/icons-material'

interface Blog {
  id: string;
  title: string;
  synopsis: string;
  content: string;
  featuredImage: string;
  createdAt: string;
  updatedAt: string;
  author: {
    firstName: string;
    lastName: string;
    username: string;
  };
}

const DashBoard = () => {
  const navigate = useNavigate();
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: async (): Promise<Blog[]> => {
      const response = await axiosInstance.get('/api/blogs');
      return response.data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/400x200?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:4000${imagePath}`;
  };

  if (isLoading) {
    return (
      <Box bgcolor={'#F3F2E7'} minHeight="100vh">
        <LayOut>
          <Box sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
              Blog Dashboard
            </Typography>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={item}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                      <Skeleton variant="text" height={60} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
              Failed to load blogs. Please try again later.
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
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            Blog Dashboard
          </Typography>
          
          {blogs && blogs.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No blogs found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Be the first to create a blog post!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {blogs?.map((blog) => (
                <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={blog.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 8
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          mb: 1,
                          fontWeight: 'bold',
                          lineHeight: 1.2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {blog.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {blog.synopsis}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                          icon={<CalendarToday sx={{ fontSize: 16 }} />}
                          label={formatDate(blog.createdAt)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Person sx={{ fontSize: 16 }} />}
                          label={blog.author.username}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'primary.main',
                            fontSize: '0.875rem'
                          }}
                        >
                          {getInitials(blog.author.firstName, blog.author.lastName)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {blog.author.firstName} {blog.author.lastName}
                        </Typography>
                      </Stack>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="small" 
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        sx={{ 
                          textTransform: 'none',
                          fontWeight: 'medium'
                        }}
                      >
                        Read More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </LayOut>
    </Box>
  )
}

export default DashBoard