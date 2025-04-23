import { Availability, Skill } from "@/@types/api";
import { User } from "@/@types/api/models/User";
import { create } from "zustand";

export interface UserWithRelations extends User {
  skills: Skill[];
  availabilities: Availability[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserWithRelations | null;
  login: (userData: { user?: UserWithRelations }) => void;
  logout: () => void;
  updateUser: (user: Partial<UserWithRelations>) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => {
    // If user is not provided in data, keep authenticated status only
    // Cookies handle the authenticated session
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
