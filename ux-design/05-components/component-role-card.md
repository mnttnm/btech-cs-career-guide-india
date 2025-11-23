# Component: Role Card

> **Reusable card component displaying role summary**

---

## Component Overview

**Purpose:** Display a role's key information in a scannable, tappable card format

**Used In:**
- Homepage (Popular Roles section)
- Browse page (Grid view)
- Quiz results (Recommended roles)
- Comparison page (Role selection)

**States:**
- Default
- Hover/Focus
- Selected (for comparison)
- Loading

---

## Visual Design

### Desktop (Hover State)
```
┌─────────────────────────────┐
│ 💻                          │ ← Icon (top-left)
│                             │
│ Frontend Developer          │ ← Role name (bold)
│                             │
│ Build beautiful web         │ ← Description (gray)
│ interfaces                  │
│                             │
│ 💰 ₹4.5-8 LPA               │ ← Salary (icon + text)
│ 📚 6-12 months              │ ← Learning time
│ 🟢 Easy                     │ ← Difficulty (color-coded)
│                             │
│ [Learn More →]              │ ← CTA button
└─────────────────────────────┘
   ↑ Slight elevation on hover
```

### Mobile
```
┌──────────────┐
│ 💻           │
│              │
│ Frontend Dev │
│              │
│ Build web    │
│ interfaces   │
│              │
│ ₹4.5-8L      │
│ 6-12mo       │
│ 🟢 Easy      │
│              │
│ [Learn More] │
└──────────────┘
```

---

## Component Props

```typescript
interface RoleCardProps {
  role: {
    roleId: string
    roleName: string
    description: string
    icon: string
    category: string
    salaryRange: {
      fresher: { min: number; max: number }
    }
    learningCurve: {
      timeToJobReady: string
      difficulty: 'Easy' | 'Moderate' | 'Hard'
    }
  }
  variant?: 'default' | 'compact' | 'detailed'
  isSelected?: boolean
  onSelect?: (roleId: string) => void
  showCompareButton?: boolean
}
```

---

## Implementation

### React + TypeScript + Tailwind

```tsx
// components/RoleCard.tsx
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface RoleCardProps {
  role: {
    roleId: string
    roleName: string
    description: string
    icon: string
    category: string
    salaryRange: {
      fresher: { min: number; max: number }
    }
    learningCurve: {
      timeToJobReady: string
      difficulty: 'Easy' | 'Moderate' | 'Hard'
    }
  }
  variant?: 'default' | 'compact'
  isSelected?: boolean
  onSelect?: (roleId: string) => void
  showCompareButton?: boolean
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-orange-100 text-orange-700',
  Hard: 'bg-red-100 text-red-700',
}

const difficultyIcons = {
  Easy: '🟢',
  Moderate: '🟡',
  Hard: '🔴',
}

export const RoleCard = ({
  role,
  variant = 'default',
  isSelected = false,
  onSelect,
  showCompareButton = false,
}: RoleCardProps) => {
  const { roleId, roleName, description, icon, salaryRange, learningCurve } = role

  const handleCardClick = () => {
    // Navigate to role detail page
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onSelect?.(roleId)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`
          h-full cursor-pointer transition-shadow
          hover:shadow-lg
          ${isSelected ? 'ring-2 ring-primary-500' : ''}
        `}
        onClick={handleCardClick}
      >
        <CardContent className="p-6 space-y-4">
          {/* Icon */}
          <div className="text-4xl">{icon}</div>

          {/* Role Name */}
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {roleName}
          </h3>

          {/* Description */}
          {variant === 'default' && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="space-y-2 text-sm">
            {/* Salary */}
            <div className="flex items-center gap-2 text-gray-700">
              <span>💰</span>
              <span>
                ₹{salaryRange.fresher.min}-{salaryRange.fresher.max} LPA
              </span>
            </div>

            {/* Learning Time */}
            <div className="flex items-center gap-2 text-gray-700">
              <span>📚</span>
              <span>{learningCurve.timeToJobReady}</span>
            </div>

            {/* Difficulty */}
            <div className="flex items-center gap-2">
              <span>{difficultyIcons[learningCurve.difficulty]}</span>
              <Badge className={difficultyColors[learningCurve.difficulty]}>
                {learningCurve.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex gap-2">
          <Link href={`/role/${roleId}`} className="flex-1">
            <Button variant="primary" className="w-full">
              Learn More →
            </Button>
          </Link>

          {showCompareButton && (
            <Button
              variant="outline"
              onClick={handleCompareClick}
              className={isSelected ? 'bg-primary-50' : ''}
            >
              {isSelected ? '✓' : '+'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
```

---

## Design Tokens Used

```css
/* Colors */
--bg-primary: #ffffff (card background)
--text-primary: #1f2937 (role name)
--text-secondary: #6b7280 (description, stats)
--ring-color: #3b82f6 (selected state)

/* Spacing */
--space-6: 1.5rem (padding)
--space-4: 1rem (gap between elements)
--space-2: 0.5rem (icon-text gap)

/* Border Radius */
--radius-xl: 0.75rem (card border)

/* Shadows */
--shadow-base: default
--shadow-lg: hover state

/* Typography */
--text-xl: 1.25rem (role name)
--text-sm: 0.875rem (description, stats)
--font-semibold: 600 (role name)
--font-normal: 400 (description)
```

---

## Variants

### Default (Full Detail)
```tsx
<RoleCard role={role} variant="default" />
```
- Shows full description
- All stats visible
- CTA button included

### Compact (Grid View)
```tsx
<RoleCard role={role} variant="compact" />
```
- Shorter description (1 line)
- Minimal stats (salary + difficulty)
- Smaller padding

### With Compare Button
```tsx
<RoleCard
  role={role}
  showCompareButton
  isSelected={selectedRoles.includes(role.roleId)}
  onSelect={handleSelectRole}
/>
```
- Shows + button (or ✓ if selected)
- Clicking + adds to comparison
- Selected state shows blue ring

---

## Responsive Behavior

### Mobile (<640px)
- Full-width cards (1 column)
- Padding: 1rem (16px)
- Font sizes slightly smaller

### Tablet (640px - 1024px)
- 2 columns
- Padding: 1.5rem (24px)
- Default font sizes

### Desktop (>1024px)
- 3-4 columns
- Hover effects enabled
- Full detail variant

```tsx
// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {roles.map(role => (
    <RoleCard key={role.roleId} role={role} />
  ))}
</div>
```

---

## Accessibility

### Keyboard Navigation
```tsx
<Card
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick()
    }
  }}
  role="button"
  aria-label={`View ${roleName} details`}
>
```

### Screen Readers
```tsx
<Card aria-labelledby={`role-${roleId}-title`}>
  <h3 id={`role-${roleId}-title`}>{roleName}</h3>
  <p aria-label="Role description">{description}</p>
  <div aria-label="Salary range">₹{min}-{max} LPA</div>
</Card>
```

### Focus State
```css
.role-card:focus {
  outline: 3px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## Loading State

```tsx
export const RoleCardSkeleton = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6 space-y-4">
      <div className="w-12 h-12 bg-gray-200 rounded" /> {/* Icon */}
      <div className="h-6 bg-gray-200 rounded w-3/4" /> {/* Title */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" /> {/* Description */}
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" /> {/* Stats */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </CardContent>
  </Card>
)
```

**Usage:**
```tsx
{isLoading ? (
  <>
    <RoleCardSkeleton />
    <RoleCardSkeleton />
    <RoleCardSkeleton />
  </>
) : (
  roles.map(role => <RoleCard key={role.roleId} role={role} />)
)}
```

---

## Error State

```tsx
export const RoleCardError = ({ error }: { error: string }) => (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-6 text-center">
      <p className="text-red-600">⚠️ {error}</p>
      <Button variant="outline" className="mt-4">
        Retry
      </Button>
    </CardContent>
  </Card>
)
```

---

## Performance Optimizations

### Image Optimization
```tsx
import Image from 'next/image'

// If using image icons instead of emoji
<Image
  src={`/images/roles/${roleId}.svg`}
  alt={roleName}
  width={48}
  height={48}
  loading="lazy"
/>
```

### Memoization
```tsx
import { memo } from 'react'

export const RoleCard = memo(({ role, ...props }: RoleCardProps) => {
  // ... component code
}, (prevProps, nextProps) => {
  return prevProps.role.roleId === nextProps.role.roleId &&
         prevProps.isSelected === nextProps.isSelected
})
```

### Virtual Scrolling (For Large Lists)
```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

// If showing 100+ role cards
const rowVirtualizer = useVirtualizer({
  count: roles.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 300, // Card height
})
```

---

## Testing

### Unit Test (Vitest + React Testing Library)
```tsx
import { render, screen } from '@testing-library/react'
import { RoleCard } from './RoleCard'

const mockRole = {
  roleId: 'frontend-developer',
  roleName: 'Frontend Developer',
  description: 'Build web interfaces',
  icon: '💻',
  category: 'software',
  salaryRange: {
    fresher: { min: 4.5, max: 8 },
  },
  learningCurve: {
    timeToJobReady: '6-12 months',
    difficulty: 'Moderate' as const,
  },
}

describe('RoleCard', () => {
  it('renders role name', () => {
    render(<RoleCard role={mockRole} />)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('displays salary range', () => {
    render(<RoleCard role={mockRole} />)
    expect(screen.getByText(/₹4.5-8 LPA/)).toBeInTheDocument()
  })

  it('shows difficulty badge with correct color', () => {
    render(<RoleCard role={mockRole} />)
    const badge = screen.getByText('Moderate')
    expect(badge).toHaveClass('bg-orange-100')
  })

  it('calls onSelect when compare button clicked', () => {
    const onSelect = jest.fn()
    render(<RoleCard role={mockRole} showCompareButton onSelect={onSelect} />)

    const compareButton = screen.getByRole('button', { name: '+' })
    compareButton.click()

    expect(onSelect).toHaveBeenCalledWith('frontend-developer')
  })
})
```

---

## Storybook Stories

```tsx
// RoleCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { RoleCard } from './RoleCard'

const meta: Meta<typeof RoleCard> = {
  title: 'Components/RoleCard',
  component: RoleCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RoleCard>

export const Default: Story = {
  args: {
    role: {
      roleId: 'frontend-developer',
      roleName: 'Frontend Developer',
      description: 'Build beautiful web interfaces',
      icon: '💻',
      category: 'software',
      salaryRange: { fresher: { min: 4.5, max: 8 } },
      learningCurve: { timeToJobReady: '6-12 months', difficulty: 'Moderate' },
    },
  },
}

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
}

export const WithCompareButton: Story = {
  args: {
    ...Default.args,
    showCompareButton: true,
  },
}

export const EasyRole: Story = {
  args: {
    role: {
      ...Default.args.role!,
      roleName: 'Data Analyst',
      learningCurve: { timeToJobReady: '4-6 months', difficulty: 'Easy' },
    },
  },
}

export const HardRole: Story = {
  args: {
    role: {
      ...Default.args.role!,
      roleName: 'ML Engineer',
      learningCurve: { timeToJobReady: '12-18 months', difficulty: 'Hard' },
    },
  },
}
```

---

## Common Pitfalls to Avoid

❌ **Don't:**
- Hardcode colors (use design tokens)
- Make entire card clickable if it has buttons (handle click propagation)
- Use vague descriptions ("Great career" → be specific)
- Show too much information (overwhelming)
- Use tiny touch targets on mobile

✅ **Do:**
- Use semantic HTML (`<article>` for card)
- Provide clear visual hierarchy
- Truncate long text with `line-clamp`
- Use optimistic UI for interactions
- Test on real mobile devices

---

## Related Components

- [Card Base Component](./component-card.md)
- [Badge Component](./component-badge.md)
- [Button Component](./component-button.md)
- [Comparison Table](./component-comparison-table.md)

---

## Changelog

- **v1.0** - Initial implementation
- **v1.1** - Added compare button variant
- **v1.2** - Added loading and error states
- **v1.3** - Performance optimizations (memo, lazy loading)

---

**Status:** ✅ Production Ready
**Last Updated:** November 2024
