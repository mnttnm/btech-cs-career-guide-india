import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesStore {
  favorites: string[]
  addFavorite: (roleId: string) => void
  removeFavorite: (roleId: string) => void
  toggleFavorite: (roleId: string) => void
  isFavorite: (roleId: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (roleId) =>
        set((state) => {
          if (state.favorites.includes(roleId)) return state
          return { favorites: [...state.favorites, roleId] }
        }),

      removeFavorite: (roleId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== roleId),
        })),

      toggleFavorite: (roleId) => {
        const state = get()
        if (state.favorites.includes(roleId)) {
          set({ favorites: state.favorites.filter((id) => id !== roleId) })
        } else {
          set({ favorites: [...state.favorites, roleId] })
        }
      },

      isFavorite: (roleId) => get().favorites.includes(roleId),
    }),
    {
      name: 'favorites-storage',
    }
  )
)
