import { create } from "zustand";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logoutUser: () => void;
  setLoading: (loading: boolean) => void;
  clearPersistedData: () => void;
}

const userStore: StateCreator<UserStore> = (set) => {
  return {
    user: null,
    isLoading: true, // Start with loading true to check authentication
    isAuthenticated: false,
    setUser: (user: User) => {
      set(() => ({ 
        user, 
        isAuthenticated: true,
        isLoading: false 
      }));
    },
    logoutUser: () => {
      set(() => ({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      }));
    },
    setLoading: (loading: boolean) => {
      set(() => ({ isLoading: loading }));
    },
    clearPersistedData: () => {
      // Clear localStorage manually
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
      }
      set(() => ({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      }));
    }
  };
};

export const useUserStore = create(
  persist(userStore, {
    name: "user-storage",
    // Only persist user data, not loading states
    partialize: (state) => ({ 
      user: state.user,
      isAuthenticated: state.isAuthenticated 
    }),
  })
);


