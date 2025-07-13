import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { Box, CircularProgress } from "@mui/material";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUserStore(); 
  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: '#F3F2E7'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  
  if (!user) {
    return null;
  }

  
  return <>{children}</>;
}

export default Protected;
