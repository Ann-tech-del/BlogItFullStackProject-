
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImageUrl: string | null | undefined;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logoutUser: () => void;
  
}

const userStore: StateCreator<UserStore> = (set) => {
  return {
    user: null,
    setUser: (user: User) => {
      set(function () {
        return { user };
      });
    },
    logoutUser: () => {
      set(function () {
        return { user: null };
      });
    },
  };
};

const useUserStore = create(persist(userStore, { name: "user" }));

export default useUserStore;
