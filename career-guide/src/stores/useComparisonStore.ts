import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ComparisonStore {
  selectedRoles: string[]
  addRole: (roleId: string) => void
  removeRole: (roleId: string) => void
  clearRoles: () => void
  isSelected: (roleId: string) => boolean
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      selectedRoles: [],

      addRole: (roleId) =>
        set((state) => {
          if (state.selectedRoles.includes(roleId)) return state
          if (state.selectedRoles.length >= 3) return state
          return { selectedRoles: [...state.selectedRoles, roleId] }
        }),

      removeRole: (roleId) =>
        set((state) => ({
          selectedRoles: state.selectedRoles.filter((id) => id !== roleId),
        })),

      clearRoles: () => set({ selectedRoles: [] }),

      isSelected: (roleId) => get().selectedRoles.includes(roleId),
    }),
    {
      name: 'comparison-storage',
    }
  )
)
