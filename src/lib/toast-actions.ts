import { toast } from 'sonner'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { useFavoritesStore } from '@/stores/useFavoritesStore'

/**
 * Toast-enabled actions for comparison and favorites
 * These wrap store actions with toast notifications and undo support
 */

export function addToComparisonWithToast(roleId: string, roleName: string) {
  const store = useComparisonStore.getState()

  // Check if already at limit
  if (store.selectedRoles.length >= 3) {
    toast.warning('Comparison full', {
      description: 'Remove a role to add another (max 3)',
    })
    return false
  }

  // Check if already selected
  if (store.isSelected(roleId)) {
    toast.info('Already in comparison', {
      description: `${roleName} is already in your comparison`,
    })
    return false
  }

  store.addRole(roleId)

  const count = useComparisonStore.getState().selectedRoles.length
  toast.success('Added to comparison', {
    description: `${roleName} (${count}/3)`,
    action: {
      label: 'Undo',
      onClick: () => {
        useComparisonStore.getState().removeRole(roleId)
      },
    },
  })
  return true
}

export function removeFromComparisonWithToast(roleId: string, roleName: string) {
  const store = useComparisonStore.getState()

  if (!store.isSelected(roleId)) return false

  store.removeRole(roleId)

  toast('Removed from comparison', {
    description: roleName,
    action: {
      label: 'Undo',
      onClick: () => {
        useComparisonStore.getState().addRole(roleId)
      },
    },
  })
  return true
}

export function clearComparisonWithToast() {
  const store = useComparisonStore.getState()
  const previousRoles = [...store.selectedRoles]

  if (previousRoles.length === 0) return false

  store.clearRoles()

  toast('Cleared comparison', {
    description: `Removed ${previousRoles.length} role${previousRoles.length > 1 ? 's' : ''}`,
    action: {
      label: 'Undo',
      onClick: () => {
        previousRoles.forEach(roleId => {
          useComparisonStore.getState().addRole(roleId)
        })
      },
    },
  })
  return true
}

export function toggleFavoriteWithToast(roleId: string, roleName: string) {
  const store = useFavoritesStore.getState()
  const wasFavorite = store.isFavorite(roleId)

  store.toggleFavorite(roleId)

  if (wasFavorite) {
    toast('Removed from favorites', {
      description: roleName,
      action: {
        label: 'Undo',
        onClick: () => {
          useFavoritesStore.getState().addFavorite(roleId)
        },
      },
    })
  } else {
    toast.success('Added to favorites', {
      description: roleName,
      action: {
        label: 'Undo',
        onClick: () => {
          useFavoritesStore.getState().removeFavorite(roleId)
        },
      },
    })
  }
}
