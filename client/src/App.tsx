

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient,QueryClientProvider} from '@tanstack/react-query'
import './App.css'
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Blog from './pages/Blog';
import CreateBlog from './pages/CreateBlog';
import Home from './pages/Home';
import DashBoard from './pages/DashBoard';
import {ThemeProvider,} from "@mui/material";
import theme from './Theme/theme';
import Protected from './components/Protected';
import Profile from './pages/Profile';
import AuthProvider from './components/AuthProvider';


const client = new QueryClient()

function App() {
  
  return (
    <>
    <QueryClientProvider client={client}>
     <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
         <Routes>
          <Route path='/' element={<Home/>}/> 
          <Route path='/blog/:id' element={<Blog/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/SignUp' element={<SignUp/>}/>
          <Route path='/dashBoard' element={<Protected><DashBoard/></Protected>}/>
           <Route path='/CreateBlog' element ={<Protected><CreateBlog/></Protected>}/>
          <Route path='/profile' element ={<Protected><Profile/></Protected>}/>
         </Routes>
        </BrowserRouter> 
      </AuthProvider>
      </ThemeProvider>  
      </QueryClientProvider>
    </>
  )
}

export default App
