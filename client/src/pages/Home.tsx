import _React from 'react'
import LayOut from '../components/LayOut'
import {Stack,Typography,Box,Button,} from "@mui/material";


const Home = () => {
  return (
   <>
 <Box sx={{bgcolor:'#F3F2E7'}}>

   <LayOut>
 <Box
          sx={{
            backgroundImage: `url('/img3.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            backgroundColor: "grey",
          }}
        >
          <Stack sx={{alignItems:'center',mt:2}}>
<Typography variant='h1' sx={{alignSelf:'center',color:'pink',}}> Speak out your mind</Typography>
<Typography variant='h2'sx={{textTransform:'uppercase',color:'white',mt:20}}>Unleash Your Ears ignite your mind</Typography>
<Stack direction={'row'} spacing={2} display="block" sx={{fontSize:'1.5rem',mt:2}}>
   
   <Button color='secondary' variant='contained' href='/LogIn' sx={{fontSize:'1.2rem',width:150}}>Log In</Button>
         <Button color='secondary' variant='contained' href='/SignUp'   sx={{fontSize:'1.2rem',width:150}}>Get Started</Button>
  
   </Stack>
           </Stack>
          
        </Box>

 
      
   
   </LayOut>
     </Box>
   </>
  )
}

export default Home