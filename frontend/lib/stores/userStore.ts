import { create } from "zustand"
import { apiService } from "@/lib/services/apiService"
import { UserWithRelations } from "./authStore"

interface UserState {
  users: UserWithRelations[]
  isLoading: boolean
  error: string | null
  fetchUsers: (options?: { random?: number; force?: boolean }) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchUsers: async (options) => {    // If not forcing and users are already loaded and not requesting random, do not refetch
    if (!options?.force && !options?.random && (get().users.length > 0 || get().isLoading)) return;
    set({ isLoading: true, error: null });
    try {
      let endpoint = "/users"
      if (options?.random) endpoint += `?random=${options.random}`
      const response = await apiService.get(endpoint) as UserWithRelations[]
      set({ users: response, isLoading: false })
    } catch {
      set({ error: "Erreur lors du chargement des membres", isLoading: false })
    }
  },
}))
