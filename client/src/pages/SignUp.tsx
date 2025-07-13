import _React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Alert
} from '@mui/material';
import {useMutation} from '@tanstack/react-query'
import axios from 'axios';
import {useNavigate}  from 'react-router-dom'
import axiosInstance from '../api/axios';
interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}


const SignUp = () => {
  const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [confPass, setConfPass] = useState("");
const [formError, setFormError] = useState("");
const navigate =useNavigate()


const { isPending,mutate } = useMutation({
  mutationKey: ["register-user"],
  mutationFn: async (newUser:User) => {
    const response = await axiosInstance.post("/api/auth/register", newUser);
    return response.data;
  },
  onError: (err)=>{
    if(axios.isAxiosError(err)){
    setFormError(err.response?.data.message)
    }
    else {
      setFormError('Something went wrong')
    }
  },
  onSuccess:()=>{
    navigate("/Login")
  }
});

function handleSignUp() {
  setFormError("")
  if (password !==confPass){
    setFormError('password and confirm password must match')
    return
  }
  const newUser = { firstName, lastName, email, username, password };
  console.log(newUser);
  mutate(newUser)

}


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F2E7',
        backgroundImage: ` url('/img1.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: 4,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%', }}
      >
       
        <Box sx={{ flex: 1, color: 'white', textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} sx={{ textTransform: 'uppercase', mb: 2 }}>
            Welcome to BlogIt
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.8rem', lineHeight: 1.6, color:'peachpuff' }}>
            Share your thoughts with the world. Join now and start your writing journey.
          </Typography>
        </Box>

       
        <Paper
          elevation={6}
          sx={{
            flex: 1,
            padding: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
           
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={2} textAlign="center">
            Sign Up
          </Typography>
          <Stack spacing={2} component={'form'}>
            { formError && <Alert severity='error'>{formError}</Alert>}
            <TextField label="First Name" fullWidth required value={firstName

            } onChange={(e)=> setFirstName(e.target.value)}/>
            <TextField label="Second Name" fullWidth required  value={lastName}  onChange={(e)=> setLastName(e.target.value)}/>
            <TextField label="User Name" fullWidth  required value={username}  onChange={(e)=> setUsername(e.target.value)}/>
            <TextField label="Email" type="email" fullWidth  required  value={email}  onChange={(e)=> setEmail(e.target.value)}/>
            <TextField label="Password" type="password" fullWidth required  value={password}  onChange={(e)=> setPassword(e.target.value)}/>
              <TextField label="Confirm Password" type="password" fullWidth required  value={confPass}  onChange={(e)=> setConfPass(e.target.value)}/>
            <Button variant="contained"  fullWidth sx={{ textTransform: 'none', fontWeight: 500, fontSize:'1.2rem' }} onClick={handleSignUp} loading={isPending}>
              Create Account
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <a href="/login" style={{ color: '#7C9584', textDecoration: 'none' }}>
                Log in
              </a>
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default SignUp;
