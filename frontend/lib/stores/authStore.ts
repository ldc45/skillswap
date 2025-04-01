import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage', // nom utilisé pour stocker dans localStorage
    }
  )
);