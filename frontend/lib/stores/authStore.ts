import { create } from "zustand";

interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: { user?: User }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => {
    // Si l'utilisateur n'est pas fourni dans les données, on garde juste le status authentifié
    // Les cookies s'occupent de la session authentifiée
    set({
      isAuthenticated: true,
      user: userData.user || null,
    });
  },
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
    }),
  updateUser: (updatedUserData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUserData } : null,
    })),
}));
