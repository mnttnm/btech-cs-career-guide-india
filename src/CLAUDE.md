# CLAUDE.md

Source code architecture for the career guide application.

## Directory Structure

- **app/**: Next.js 16 App Router pages (all client-side rendered)
- **components/**: Reusable UI components
- **data/**: Role JSON files and data utilities
- **stores/**: Zustand state management
- **types/**: TypeScript interfaces
- **lib/**: Utility functions

## Pages

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Homepage with hero, popular roles, categories |
| `/browse` | `app/browse/page.tsx` | Role listing with filters and search |
| `/quiz` | `app/quiz/page.tsx` | 12-question personality quiz |
| `/compare` | `app/compare/page.tsx` | Side-by-side role comparison (max 3) |
| `/role/[roleId]` | `app/role/[roleId]/page.tsx` | Detailed role information |

## State Management

Three Zustand stores with localStorage persistence:
- `useFavoritesStore`: User's favorited roles
- `useComparisonStore`: Selected roles for comparison (max 3)
- `useQuizStore`: Quiz progress and results

## Data Flow

1. Role data defined in `data/roles/*.json` (45 files)
2. Loaded via utilities in `data/roles.ts`
3. Type-safe with interfaces from `types/role.ts`
4. Quiz scoring logic in `data/quiz.ts`
