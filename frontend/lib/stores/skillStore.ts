import { create } from "zustand"
import { Skill } from "@/@types/api"
import { apiService } from "@/lib/services/apiService"

interface SkillState {
  skills: Skill[]
  isLoading: boolean
  error: string | null
  fetchSkills: () => Promise<void>
}

export const useSkillStore = create<SkillState>((set, get) => ({
  skills: [],
  isLoading: false,
  error: null,
  fetchSkills: async () => {
    if (get().skills.length > 0 || get().isLoading) return // Prevent refetch if already loaded or loading
    set({ isLoading: true, error: null })
    try {
      const response = await apiService.get("/skills") as Skill[]
      set({ skills: response, isLoading: false })
    } catch {
      set({ error: "Erreur lors du chargement des compétences", isLoading: false })
    }
  },
}))
