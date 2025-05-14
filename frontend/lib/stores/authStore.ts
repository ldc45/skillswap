import { User } from "@/@types/api/models/User";
import { create } from "zustand";

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
