# Tech Stack & Implementation Guide

> **Recommended technologies and implementation approach**

---

## 🎯 Technology Selection Criteria

When choosing technologies for this app, we prioritized:
- ✅ **Performance** - Fast load times on 3G networks
- ✅ **Developer Experience** - Quick iteration and debugging
- ✅ **Mobile-First** - Responsive by default
- ✅ **SEO** - Server-side rendering for discoverability
- ✅ **Cost** - Generous free tiers for MVP
- ✅ **Scalability** - Easy to scale when traffic grows

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│           Frontend (Next.js)            │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Pages   │  │Components│  │  Hooks ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Layer (JSON/API)           │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ Static   │  │   API    │  │ Local  ││
│  │  JSON    │  │  Routes  │  │Storage ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Deployment (Vercel/Netlify)        │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   CDN    │  │   Edge   │  │Analytics│
│  │          │  │Functions │  │        ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
```

---

## 🚀 Recommended Stack (MVP)

### Frontend Framework: **Next.js 14+**

**Why Next.js:**
- ✅ Server-side rendering (SSR) → Better SEO, faster initial load
- ✅ Static site generation (SSG) → Build role pages once, serve fast
- ✅ API routes → Backend logic without separate server
- ✅ Image optimization built-in
- ✅ File-based routing → Easy to add new pages
- ✅ Great developer experience

**Alternatives:**
- **Remix:** Similar features, excellent form handling
- **Astro:** If mostly static content, minimal JS
- **Vite + React:** If you don't need SSR

**Installation:**
```bash
npx create-next-app@latest career-guide \
  --typescript \
  --tailwind \
  --app \
  --src-dir
```

---

### Styling: **Tailwind CSS**

**Why Tailwind:**
- ✅ Utility-first → Fast development
- ✅ Responsive design made easy
- ✅ Purges unused CSS → Tiny bundles
- ✅ Dark mode support
- ✅ Consistent design system

**Configuration:**
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}
```

**Alternatives:**
- **CSS Modules:** If prefer traditional CSS
- **Styled Components:** CSS-in-JS (larger bundle)
- **shadcn/ui:** Unstyled components + Tailwind

---

### Component Library: **Headless UI + Radix UI**

**Why Headless:**
- ✅ Accessible by default (WAI-ARIA compliant)
- ✅ Unstyled → Full design control
- ✅ Small bundle size
- ✅ Works perfectly with Tailwind

**Components to Use:**
```tsx
// Accordion (for collapsible sections)
import * as Accordion from '@radix-ui/react-accordion'

// Dialog (for modals)
import { Dialog } from '@headlessui/react'

// Tabs (for switchers)
import * as Tabs from '@radix-ui/react-tabs'
```

**Installation:**
```bash
npm install @radix-ui/react-accordion
npm install @radix-ui/react-dialog
npm install @radix-ui/react-tabs
npm install @radix-ui/react-progress
npm install @headlessui/react
```

**Alternative:**
- **shadcn/ui:** Pre-styled Radix components (copy-paste)

---

### State Management: **Zustand**

**Why Zustand:**
- ✅ Minimal boilerplate (no providers, actions, reducers)
- ✅ Small bundle size (1KB)
- ✅ TypeScript friendly
- ✅ Easy to test

**Example Store:**
```typescript
// stores/useComparisonStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ComparisonStore {
  selectedRoles: string[]
  addRole: (roleId: string) => void
  removeRole: (roleId: string) => void
  clearRoles: () => void
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set) => ({
      selectedRoles: [],
      addRole: (roleId) =>
        set((state) => ({
          selectedRoles: [...state.selectedRoles, roleId].slice(0, 3),
        })),
      removeRole: (roleId) =>
        set((state) => ({
          selectedRoles: state.selectedRoles.filter((id) => id !== roleId),
        })),
      clearRoles: () => set({ selectedRoles: [] }),
    }),
    {
      name: 'comparison-storage',
    }
  )
)
```

**What to Store:**
- Selected roles for comparison (max 3)
- Favorites/saved roles
- Quiz results
- User preferences (year, skill level)
- Roadmap progress

**Alternatives:**
- **Jotai:** Atomic state, minimal
- **Context API:** Built-in, but more boilerplate
- **Redux Toolkit:** Overkill for this app

---

### Data Fetching: **Static JSON (MVP) → Supabase (V2)**

#### Phase 1: Static JSON Files
**Why Start Simple:**
- ✅ No database setup needed
- ✅ Fast builds (static site generation)
- ✅ Free hosting
- ✅ Easy to version control (Git)

**Data Structure:**
```
data/
├── roles.json           → All roles metadata
├── roles/
│   ├── frontend-developer.json
│   ├── backend-developer.json
│   └── ...
└── quiz/
    └── questions.json
```

**Example:**
```json
// data/roles.json
[
  {
    "roleId": "frontend-developer",
    "roleName": "Frontend Developer",
    "category": "software",
    "difficulty": "moderate",
    "salaryRange": {
      "fresher": { "min": 4.5, "max": 8 },
      "fiveYears": { "min": 15, "max": 25 }
    }
  }
]
```

#### Phase 2: Database (When You Need It)
**Use Supabase When:**
- User accounts (save favorites, progress)
- Real-time features (leaderboard, community)
- User-generated content (success stories)
- Analytics (detailed tracking)

**Supabase Setup:**
```bash
npm install @supabase/supabase-js
```

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Alternatives:**
- **Firebase:** Good for real-time, auth
- **PlanetScale:** Serverless MySQL
- **MongoDB Atlas:** NoSQL, free tier

---

### Charts/Visualizations: **Recharts**

**Why Recharts:**
- ✅ Built on D3.js (powerful)
- ✅ React-friendly (components)
- ✅ Responsive by default
- ✅ Customizable

**Example:**
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

const SalaryChart = ({ data }) => (
  <LineChart width={300} height={200} data={data}>
    <XAxis dataKey="years" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="salary" stroke="#3b82f6" />
  </LineChart>
)
```

**Alternative:**
- **Chart.js + react-chartjs-2:** Simpler API
- **Visx:** More control, steeper learning curve

**Installation:**
```bash
npm install recharts
```

---

### Animations: **Framer Motion**

**Why Framer Motion:**
- ✅ Declarative animations (easy syntax)
- ✅ Gesture support (swipe, drag)
- ✅ Layout animations (automatic)
- ✅ Performance optimized

**Example:**
```tsx
import { motion } from 'framer-motion'

const RoleCard = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
  >
    Card content
  </motion.div>
)
```

**Use For:**
- Card hover effects
- Modal open/close
- Accordion expand/collapse
- Confetti celebrations
- Progress ring animations

**Installation:**
```bash
npm install framer-motion
```

---

### Analytics: **Plausible** or **PostHog**

**Recommended: Plausible**

**Why Plausible:**
- ✅ Privacy-friendly (GDPR compliant)
- ✅ Lightweight (<1KB script)
- ✅ No cookie banner needed
- ✅ Simple, clean dashboard
- ✅ €9/month for 10k visitors

**Installation:**
```html
<!-- Add to _app.tsx or layout.tsx -->
<script defer data-domain="yoursite.com" src="https://plausible.io/js/script.js"></script>
```

**Alternative: PostHog**
- Open-source
- Self-hostable
- Feature flags + A/B testing
- More complex setup

**What to Track:**
- Page views (which roles are popular)
- Quiz completion rate
- Comparison usage
- Roadmap creation
- Button clicks (CTAs)

---

### Hosting: **Vercel**

**Why Vercel:**
- ✅ Made by Next.js creators (perfect integration)
- ✅ Auto-deploy on git push
- ✅ Free tier: 100GB bandwidth/month
- ✅ Global CDN (fast everywhere)
- ✅ Preview deployments (test before merge)
- ✅ Analytics built-in

**Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Alternatives:**
- **Netlify:** Similar features, great DX
- **Cloudflare Pages:** Fastest CDN, generous free tier
- **AWS Amplify:** If using AWS ecosystem

---

## 📂 Project Structure

```
career-guide/
├── public/                  # Static assets
│   ├── images/
│   │   ├── roles/          # Role icons
│   │   └── og-images/      # Open Graph images
│   └── icons/              # UI icons
│
├── src/
│   ├── app/                # Next.js 14 app directory
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   │
│   │   ├── browse/
│   │   │   └── page.tsx
│   │   │
│   │   ├── role/
│   │   │   └── [roleId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── compare/
│   │   │   └── page.tsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── page.tsx
│   │   │   └── results/
│   │   │       └── page.tsx
│   │   │
│   │   ├── roadmap/
│   │   │   └── page.tsx
│   │   │
│   │   └── api/            # API routes
│   │       ├── quiz/
│   │       │   └── score/
│   │       │       └── route.ts
│   │       └── roles/
│   │           └── route.ts
│   │
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   │
│   │   ├── RoleCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── ...
│   │
│   ├── lib/               # Utilities & helpers
│   │   ├── api.ts         # API client
│   │   ├── quiz-scoring.ts
│   │   ├── filters.ts
│   │   ├── analytics.ts
│   │   └── utils.ts
│   │
│   ├── stores/            # Zustand stores
│   │   ├── useComparisonStore.ts
│   │   ├── useFavoritesStore.ts
│   │   ├── useQuizStore.ts
│   │   └── useRoadmapStore.ts
│   │
│   ├── types/             # TypeScript types
│   │   ├── role.ts
│   │   ├── quiz.ts
│   │   └── roadmap.ts
│   │
│   └── data/              # Static JSON data
│       ├── roles.json
│       ├── roles/
│       │   ├── frontend-developer.json
│       │   └── ...
│       └── quiz/
│           └── questions.json
│
├── tests/                 # Tests (later)
│   ├── unit/
│   └── e2e/
│
├── .env.local             # Environment variables
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
├── tsconfig.json          # TypeScript config
└── package.json
```

---

## 🔧 Development Setup

### Prerequisites
```bash
node --version  # v18+ required
npm --version   # v9+
```

### Initial Setup
```bash
# Clone repo
git clone <repo-url>
cd career-guide

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ID=your-plausible-domain

# If using Supabase (V2)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🧪 Testing Strategy

### Phase 1 (MVP): Manual Testing
- Click through all user flows
- Test on real devices (mobile, tablet, desktop)
- Cross-browser testing (Chrome, Safari, Firefox)
- Lighthouse audits

### Phase 2: Automated Testing

**Unit Tests (Vitest):**
```bash
npm install -D vitest @testing-library/react
```

Test:
- Utility functions (quiz scoring, filtering)
- Component logic (not UI)

**E2E Tests (Playwright):**
```bash
npm install -D @playwright/test
```

Test:
- Critical flows (quiz, comparison, roadmap)
- Mobile and desktop
- Cross-browser

---

## 📊 Performance Optimization

### Images
```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/images/roles/frontend.svg"
  alt="Frontend Developer"
  width={64}
  height={64}
  loading="lazy"
/>
```

### Code Splitting
```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic'

const SalaryChart = dynamic(() => import('@/components/SalaryChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,
})
```

### Fonts
```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
```

### Bundle Analysis
```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

---

## 🚀 Deployment Workflow

### CI/CD with Vercel
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
```

### Preview Deployments
- Every PR gets a preview URL
- Test before merging
- Share with stakeholders

---

## 💰 Cost Estimate (Monthly)

### MVP (0-1000 users/month)
- **Hosting (Vercel):** $0 (free tier)
- **Analytics (Plausible):** $9
- **Domain:** $12/year = $1/month
- **Total:** ~$10/month

### Growth (10k users/month)
- **Hosting (Vercel Pro):** $20
- **Database (Supabase Pro):** $25
- **Analytics (Plausible):** $9
- **CDN/Images (Cloudinary):** $0-10
- **Total:** ~$55-65/month

---

## 📚 Recommended Learning Resources

### Next.js
- [Official Next.js Tutorial](https://nextjs.org/learn)
- [Next.js 14 Docs](https://nextjs.org/docs)

### Tailwind CSS
- [Official Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Total TypeScript](https://www.totaltypescript.com)

---

## 🎯 Implementation Phases

### Phase 1: MVP (4-6 weeks)
- ✅ Homepage + Browse + Role Detail
- ✅ Personality Quiz + Results
- ✅ Comparison Tool
- ✅ Basic Roadmap
- ✅ Mobile-responsive

### Phase 2: Enhancement (2-3 weeks)
- ✅ Favorites/Saved roles
- ✅ PDF downloads
- ✅ Share functionality
- ✅ Progress tracking
- ✅ Analytics integration

### Phase 3: Scale (Ongoing)
- ✅ User accounts (Supabase)
- ✅ Community features
- ✅ Learning resources
- ✅ Job board integration

---

**Next:** See [Project Structure](./project-structure.md) for detailed file organization
