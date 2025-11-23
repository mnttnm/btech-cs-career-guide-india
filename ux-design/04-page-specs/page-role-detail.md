# Page Specification: Role Detail

> **Comprehensive role information with progressive disclosure**

---

## Page Overview

**Purpose:** Provide all information about a specific career role in digestible, scannable format

**User Goal:** Understand if this role fits their skills, interests, and career goals

**Success Metrics:**
- 50%+ expand at least 3 sections
- 30%+ add to comparison or favorites
- 20%+ scroll to bottom
- 15%+ take action (compare, download, roadmap)

---

## URL Structure

```
/role/[roleId]
/role/frontend-developer
/role/data-analyst
/role/ml-engineer
```

---

## Page Layout (Mobile)

```
┌─────────────────────────────┐
│ [← Back]   Frontend Dev [♡] │ ← Sticky header
├─────────────────────────────┤
│ [▓▓▓▓░░░░░░░░] 30%          │ ← Reading progress
├─────────────────────────────┤
│                             │
│ 💻 Frontend Developer       │ ← Hero section
│                             │
│ Build beautiful, responsive │
│ web interfaces that users   │
│ interact with daily         │
│                             │
│ ┌─────────────────────────┐ │
│ │ 💰 Fresher: ₹4.5-8L     │ │ ← Key stats grid
│ │ 📈 5-Year:  ₹15-25L     │ │
│ │                          │ │
│ │ 📚 Learning: 6-12 months│ │
│ │ 😊 Stress:   Medium     │ │
│ │ 🎯 Difficulty: Moderate │ │
│ └─────────────────────────┘ │
│                             │
│ Job Titles:                 │
│ Junior Frontend Developer,  │
│ UI Developer, Frontend      │
│ Trainee                     │
│                             │
│ ▶ Skills Required (9)       │ ← Collapsed sections
│                             │
│ ▼ What You'll Do Daily      │ ← Expanded (default)
│   • Build user interfaces   │
│   • Collaborate with        │
│     designers               │
│   • Optimize performance    │
│   • Write tests & reviews   │
│   [Read more...]            │
│                             │
│ ▶ Career Progression        │
│                             │
│ ▼ Is This For You? (87%)    │ ← Quiz match shown
│   You'll thrive if:         │
│   ✅ You enjoy visual work  │
│   ✅ You like immediate     │
│      results                │
│   Avoid if:                 │
│   ❌ You prefer algorithmic │
│      problems               │
│   [See why 87% match...]    │
│                             │
│ ▶ College Roadmap           │ ← Year 2 highlighted
│                             │
│ ▶ First Job Strategy        │
│                             │
│ ▶ Top Companies Hiring      │
│                             │
├─────────────────────────────┤
│ [Compare] [Download PDF]    │ ← Sticky footer
└─────────────────────────────┘
```

---

## Section Breakdown

### 1. Header (Sticky)

**Components:**
- Back button (top-left) → Returns to browse with filters preserved
- Page title (center/left): "Frontend Developer"
- Favorite heart icon (top-right) → Toggleable

**Behavior:**
- Sticky on scroll
- Adds subtle shadow when scrolled
- Collapses to show only title + icons on scroll (mobile)

**Code Example:**
```tsx
<header className="sticky top-0 z-sticky bg-white shadow-sm">
  <div className="flex items-center justify-between p-4">
    <button onClick={goBack}>← Browse</button>
    <h1 className="text-lg font-semibold">Frontend Developer</h1>
    <button onClick={toggleFavorite}>
      {isFavorite ? '❤️' : '♡'}
    </button>
  </div>
  <ProgressBar progress={scrollProgress} />
</header>
```

---

### 2. Reading Progress Bar

**Specs:**
- Height: 4px
- Color: Primary blue
- Position: Below header, sticky
- Calculation: `(scrollY / (pageHeight - windowHeight)) * 100`

**States:**
- 0%: Empty bar
- 50%: Half filled
- 100%: Fully filled (confetti animation?)

---

### 3. Hero Section

**Content:**
- Icon (64x64px) - Unique per role
- Role name (H1, 32px, bold)
- Description (1-2 sentences, 18px)
- Key stats grid (2x3 on mobile, 3x2 on desktop)

**Key Stats Grid:**
```
┌──────────────┬──────────────┐
│ 💰 Fresher   │ 📈 5-Year    │
│ ₹4.5-8 LPA   │ ₹15-25 LPA   │
├──────────────┼──────────────┤
│ 📚 Learning  │ 😊 Stress    │
│ 6-12 months  │ Medium       │
├──────────────┼──────────────┤
│ 🎯 Difficulty│ 👥 Demand    │
│ Moderate     │ High         │
└──────────────┴──────────────┘
```

**Color Coding:**
- **Difficulty:** Easy (Green), Moderate (Orange), Hard (Red)
- **Stress:** Low (Green), Medium (Orange), High (Red)
- **Salary:** High (Green), Medium (Blue), Entry (Orange)

---

### 4. Job Titles Section

**Content:**
```
Job Titles:
Fresher: Junior Frontend Developer, UI Developer, Frontend Trainee
Experienced: Senior Frontend Developer, Lead Engineer, Frontend Architect
```

**Format:**
- Inline list (comma-separated)
- Or: Toggle between Fresher/Experienced
- Font: 16px, gray text

---

### 5. Collapsible Sections (Accordion)

#### Default State
- **Expanded:** "What You'll Do Daily" (most important for fit)
- **Collapsed:** All others

#### Interaction
- Tap anywhere on section header to expand/collapse
- Smooth animation (300ms ease-in-out)
- Icon changes: ▶ (collapsed) → ▼ (expanded)

#### Section Order (Priority)
1. ✅ What You'll Do Daily
2. Skills Required
3. Is This For You? (Personality Fit)
4. Career Progression
5. College Roadmap
6. First Job Strategy
7. Top Companies Hiring

---

### Section A: Skills Required

**Content Structure:**
```
▼ Skills Required

Programming Languages (Primary)
┌──────────┐ ┌──────────┐ ┌──────────┐
│JavaScript│ │TypeScript│ │HTML/CSS  │
│Advanced  │ │Intermed. │ │Advanced  │
│PRIMARY   │ │PRIMARY   │ │PRIMARY   │
└──────────┘ └──────────┘ └──────────┘

Frameworks & Tools (Learn 1-2)
[React ⭐⭐⭐] [Next.js ⭐⭐⭐] [Vue.js ⭐⭐] [Tailwind ⭐⭐]

Core Concepts
• DOM Manipulation
• Responsive Design
• State Management
• Web Performance

[Show detailed learning path →]
```

**Component:**
- **Tag pills** for languages/frameworks
- **Star ratings** for popularity
- **Bullet list** for concepts
- **CTA link** to detailed resources (future)

---

### Section B: What You'll Do Daily

**Content:**
```
▼ What You'll Do Daily

• Build and maintain user interfaces using React/Vue/Angular
• Collaborate with designers to implement pixel-perfect designs
• Optimize application performance and loading times
• Write unit tests and conduct code reviews
• Debug cross-browser compatibility issues
• Participate in daily standups and sprint planning
• Learn new frontend technologies and best practices

[Read more...] (if truncated)
```

**Format:**
- Bullet list (7-8 items max)
- Truncate at 5 items on initial load
- "Read more" expands to show all

---

### Section C: Career Progression

**Content:**
```
▼ Career Progression

Timeline:
0-2 years → 3-6 years → 7-10 years
Junior      Senior      Lead/Architect
₹3-8L       ₹8-18L      ₹18-40L

[Interactive timeline visualization]

Career Tracks:
→ Leadership: Tech Lead → Eng Manager → Director
→ Individual Contributor: Senior → Staff → Principal

Alternative Paths:
• Full-Stack Developer (learn backend)
• UI/UX Designer (design focus)
• Mobile Developer (React Native)

[Explore career paths →]
```

**Visualization:**
- Horizontal timeline (mobile)
- Vertical timeline (desktop)
- Nodes for each level
- Hover/tap for details

---

### Section D: Is This For You? (Personality Fit)

**Content:**
```
▼ Is This For You?

Your Match: 87% (if quiz taken)
[Circular progress ring visualization]

You'll thrive if:
✅ You enjoy visual, creative problem-solving
✅ You have an eye for design and user experience
✅ You like seeing immediate results of your work
✅ You're comfortable with constant learning
✅ You enjoy collaborating with designers

Avoid if:
❌ You prefer working on deep algorithmic problems
❌ You find UI/UX details tedious
❌ You dislike dealing with browser quirks
❌ You want a slowly-evolving tech stack

[Take personality quiz →] (if not taken)
[Retake quiz →] (if taken)
```

**Visual Treatment:**
- ✅ Green checkmarks for "Thrive"
- ❌ Red X for "Avoid"
- Match score as circular progress ring
- CTA to quiz if not taken

---

### Section E: College Roadmap

**Content:**
```
▼ College Roadmap

Year 1 ✓ → Year 2 📍 → Year 3 → Year 4
         YOU ARE HERE

Year 2: Deepening
☐ Learn React or Vue.js framework
☐ Build 2-3 dynamic web apps with API integration
☐ Participate in hackathons (focus on UI quality)
☐ Contribute to open source frontend projects
☐ Learn responsive design and Tailwind CSS
☐ Start a technical blog about your learnings

[Create My Roadmap →]
```

**Features:**
- Current year auto-highlighted (from quiz or manual selection)
- Checkboxes (read-only on role page, interactive on roadmap page)
- Visual timeline connector
- CTA to create personalized roadmap

---

### Section F: First Job Strategy

**Content:**
```
▼ First Job Strategy

Technical Prep:
✓ Build 3 complex projects with advanced React patterns
✓ Solve 100+ LeetCode Easy/Medium problems
✓ Create polished portfolio website
✓ Get 1-2 certifications (freeCodeCamp, Frontend Masters)

Application Strategy:
→ Campus Placements (prioritize)
→ Off-Campus (AngelList, Instahyre, Naukri)
→ Referrals (network on LinkedIn)
→ Startups (faster growth, lower initial pay)

Interview Prep:
• JavaScript fundamentals (closures, promises, async/await)
• React concepts (lifecycle, hooks, state management)
• CSS (flexbox, grid, positioning)
• Build project live during interview

Salary Expectations:
Service-based: ₹3-5 LPA
Product-based: ₹6-12 LPA
Top Tech (FAANG): ₹15-25 LPA

[Download full strategy PDF →]
```

---

### Section G: Top Companies Hiring

**Content:**
```
▼ Top Companies Hiring

Product Companies:
Google, Microsoft, Amazon, Flipkart, Swiggy, Zomato

Service Companies:
TCS, Infosys, Wipro, Accenture, HCL

Startups:
CRED, Razorpay, Zerodha, Freshworks

[See all companies →] (future)
```

---

### 6. Sticky Footer Actions

**Buttons:**
1. **Compare** - Add to comparison (primary button)
2. **Download PDF** - Download role summary (secondary button)
3. **Share** - Share role link (icon button)

**Behavior:**
- Visible on scroll past hero section
- Hides when at bottom of page
- Mobile: Full-width buttons stacked
- Desktop: Inline buttons

**Code Example:**
```tsx
<footer className="sticky bottom-0 z-sticky bg-white border-t p-4 flex gap-3">
  <button className="btn-primary flex-1" onClick={addToCompare}>
    Compare
  </button>
  <button className="btn-secondary flex-1" onClick={downloadPDF}>
    Download PDF
  </button>
  <button className="btn-icon" onClick={share}>
    📤
  </button>
</footer>
```

---

## Responsive Design

### Mobile (<768px)
- Single column layout
- 2-column stats grid
- Full-width sections
- Bottom sticky actions

### Tablet (768px - 1024px)
- Single column layout
- 3-column stats grid
- Wider content area

### Desktop (>1024px)
- **Left sidebar:** Table of contents (sticky)
- **Main content:** Role details
- **Right sidebar:** Quick actions, related roles (optional)

**Desktop Layout:**
```
┌────────┬──────────────────────┬────────┐
│  TOC   │   Main Content       │ Actions│
│ (sticky│                      │(sticky)│
│  nav)  │                      │        │
│        │                      │        │
│ Skills │   [Hero Section]     │Compare │
│ Daily  │                      │Download│
│ Career │   [Sections...]      │Share   │
│ Fit    │                      │        │
│ ...    │                      │Related │
│        │                      │Roles   │
└────────┴──────────────────────┴────────┘
```

---

## Loading States

### Initial Load
```
[Skeleton loader]
┌─────────────────────────────┐
│ ░░░░░░░░░░░░░░░░            │ ← Shimmer animation
│                             │
│ ░░░░░░░░░░░                 │
│ ░░░░░░░░░░░░░░░░░░░░░       │
│                             │
│ ┌─────────────────────────┐ │
│ │ ░░░░  ░░░░  ░░░░        │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Section Expansion
- Smooth height animation
- Content fades in

### Data Fetching
- Show loading spinner in section
- Preserve section height (no layout shift)

---

## Error States

### Role Not Found
```
┌─────────────────────────────┐
│   404 - Role Not Found      │
│                             │
│   [Illustration]            │
│                             │
│   This role doesn't exist   │
│   or has been removed.      │
│                             │
│   [Browse All Roles →]      │
└─────────────────────────────┘
```

### Network Error
```
[Retry banner]
Couldn't load role details. [Retry]
```

---

## Accessibility

### Keyboard Navigation
- Tab through sections
- Enter/Space to expand/collapse
- Escape to collapse all

### Screen Readers
```html
<section aria-expanded="true" aria-labelledby="skills-header">
  <h2 id="skills-header">Skills Required</h2>
  <!-- Content -->
</section>
```

### Focus Management
- Focus on section header when expanded
- Skip links to main content

---

## Performance Targets

- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Largest Contentful Paint:** <2.5s
- **Cumulative Layout Shift:** <0.1

### Optimizations
- Lazy-load images in collapsed sections
- Code-split visualizations (charts)
- Prefetch related roles on hover
- Cache role data (localStorage)

---

## SEO Optimization

### Meta Tags
```html
<title>Frontend Developer Career Guide | Salary, Skills, Roadmap</title>
<meta name="description" content="Complete guide to becoming a Frontend Developer in India. Salary ranges, required skills, career progression, and personalized roadmap." />
<meta property="og:title" content="Frontend Developer Career Guide" />
<meta property="og:image" content="/og-images/frontend-developer.png" />
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Frontend Developer Career Path",
  "description": "Complete guide to frontend development career",
  "provider": {
    "@type": "Organization",
    "name": "Career Guide"
  }
}
```

---

## Analytics Tracking

### Events to Track
- `role_viewed`: { roleId, source }
- `section_expanded`: { roleId, sectionName }
- `scroll_depth`: { roleId, depth: '25%|50%|75%|100%' }
- `add_to_compare`: { roleId }
- `add_to_favorites`: { roleId }
- `download_pdf`: { roleId }
- `cta_clicked`: { roleId, ctaType: 'quiz|roadmap|compare' }

---

## Future Enhancements

- **Video introduction** to role (30-60s)
- **Day in the life** photo gallery
- **Salary calculator** based on location, company type
- **Real job listings** integrated
- **Alumni testimonials** from this role
- **Related courses** suggestions
- **Mentor matching** for this role

---

**Related:**
- [Component: Role Card](../05-components/component-role-card.md)
- [Component: Comparison Table](../05-components/component-comparison-table.md)
- [Workflow: First Visit](../01-user-journeys/workflow-first-visit.md)
