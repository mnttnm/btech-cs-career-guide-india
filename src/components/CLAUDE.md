# CLAUDE.md

Component conventions for this project.

## Structure

- **ui/**: Shadcn/ui components (Radix-based, follow Shadcn patterns)
- **Navigation.tsx**: App header with desktop/mobile nav, badges for favorites/comparison
- **RoleCard.tsx**: Role display card with `default` and `compact` variants

## Shadcn/ui Components

Located in `ui/`: accordion, badge, button, card, checkbox, dialog, progress, slider, tabs

Adding new Shadcn components:
```bash
npx shadcn@latest add [component-name]
```

Configuration in `/components.json`: new-york style, lucide icons, RSC enabled.

## Conventions

- Use `cn()` from `@/lib/utils` for conditional class merging
- Framer Motion for animations (entrance effects, hover states)
- Lucide React for icons
- Mobile-first responsive design with Tailwind breakpoints