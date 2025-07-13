
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7C9584', 
    },
    secondary: {
      main: '#A7C1A4', 
    },
    background: {
      default: '#F3F2E7', 
      paper: '#F3F2E7',  
    },
    text: {
      primary: '#3E4A42',
      secondary: '#6B7B6F',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#3E4A42',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
      color: '#3E4A42',
    },
    body1: {
      fontSize: '1.5rem',
      lineHeight: 1.6,
      color: '#3E4A42',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#D2D8B9',
        },
      },
    },
  },
});

export default theme;
