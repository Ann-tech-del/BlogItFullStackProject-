import _React from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  
} from '@mui/material';
import {useState} from 'react'
import {  useNavigate} from 'react-router-dom'
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import axios from 'axios';
import { useUserStore } from '../store/userStore';
interface LogInDetails{
  identifier:string,
  password : string
}


const Login = () => {
  const {setUser} = useUserStore();
const navigate = useNavigate()
  const [identifier,setIdentifier] = useState("")
  const [password,setPassoward] = useState("")
  const [formError,setFormError]=useState("")

  const {isPending,mutate}  = useMutation({
    mutationKey:["log in user"],
    mutationFn: async (logInDetails :LogInDetails)=>{
     const response = await axiosInstance.post("/api/auth/login",logInDetails) 
      return response.data
    },
    onError: (err) => {
  if (axios.isAxiosError(err)) {
    setFormError(err.response?.data.message);
  } else {
    setFormError('Something went wrong');
  }
},
onSuccess:(data)=>{
  setUser(data)
  navigate('/dashBoard')
}

  })
  function handleLogIn (){
    setFormError("")
    mutate({identifier,password})
  }
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url('/img4.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 5,
        }}
      >
        <Typography variant="h4" fontWeight={600} sx={{color:'primary'}}>
          Find your sweet home
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, mb: 4, color:'peachpuff' }}>
          Start Blogging in just a few clicks.
        </Typography>
      </Box>

      
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          backgroundColor: '#F3F2E7',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400, }}>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{color:'#3E4A42'}}>
            Welcome Back to BlogIt!
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to your account
          </Typography>

          <Stack spacing={2}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField label="Email or userName" fullWidth required value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
            <TextField label="Password" type="password" fullWidth  required  value={password} onChange={(e)=>setPassoward(e.target.value)}/>
            <Button
              variant="contained"
              fullWidth
              sx={{
                
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#333' },
              }}
             
              onClick={handleLogIn}
              loading = {isPending}
            >
              Login
            </Button>
          </Stack>

          <Typography variant="body2" align="center" mt={3}>
            Don’t have any account?{' '}
            <a href="/Signup" style={{ textDecoration: 'none', color: '#3f51b5' }}>
              Create One
            </a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
