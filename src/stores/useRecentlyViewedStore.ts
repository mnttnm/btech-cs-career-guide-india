import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_ROLES = 6

interface RecentlyViewedStore {
  recentRoleIds: string[]
  addRecentRole: (roleId: string) => void
  clearRecentRoles: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      recentRoleIds: [],

      addRecentRole: (roleId) =>
        set((state) => {
          // Remove if already exists to move to front
          const filtered = state.recentRoleIds.filter((id) => id !== roleId)
          // Add to front and limit to max
          return {
            recentRoleIds: [roleId, ...filtered].slice(0, MAX_RECENT_ROLES),
          }
        }),

      clearRecentRoles: () => set({ recentRoleIds: [] }),
    }),
    {
      name: 'recently-viewed-storage',
    }
  )
)
