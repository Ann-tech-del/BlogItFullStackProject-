import { useEffect, useState } from 'react';
import  useUserStore  from '../store/userStore';
import axiosInstance from '../api/axios';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user, setUser, logoutUser } = useUserStore();
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const response = await axiosInstance.get('/api/auth/profile');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Session validation failed, clearing user data');
        logoutUser();
        setLoading(false);
      }
    };
    validateSession();
  }, [user, setUser, logoutUser]);

 

  return <>{children}</>;
};

export default AuthProvider; 