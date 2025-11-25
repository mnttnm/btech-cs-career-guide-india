# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B.Tech CS Career Guide India - A Next.js 16 web application providing comprehensive career guidance for Indian B.Tech students. Features 45+ tech career paths with interactive browsing, comparison tools, and a personality-based quiz.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
npm start        # Run production server
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui (Radix primitives)
- **State**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Scope

This project focuses on UI work. Tasks will primarily involve fixing existing UIs and creating new UI workflows.

## Architecture

```
src/
├── app/           # Next.js App Router pages
├── components/    # UI components (Shadcn/ui + custom)
├── data/          # Role JSON data + loader utilities
├── stores/        # Zustand state (favorites, comparison, quiz)
├── types/         # TypeScript interfaces
└── lib/           # Utilities (cn helper)
```

## Key Patterns

- All pages use `'use client'` directive (client-side rendering)
- Path alias: `@/*` maps to `./src/*`
- Zustand stores persist to localStorage
- Role data loaded from JSON files via `src/data/roles.ts`

## Git Commits

Do not include "Co-Authored-By: Claude" in commit messages.
