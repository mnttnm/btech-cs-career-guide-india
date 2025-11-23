# Sitemap & Information Architecture

> **3-level hierarchy with progressive disclosure**

---

## Complete Sitemap

```
📱 Career Guidance App
│
├── 🏠 Home
│   ├── Hero Section
│   ├── Popular Roles (4-6 cards)
│   ├── How It Works
│   ├── Success Stories
│   └── FAQ
│
├── 🔍 Browse Roles
│   ├── All Roles Grid (15+ roles)
│   ├── Filters
│   │   ├── By Category
│   │   ├── By Salary
│   │   ├── By Difficulty
│   │   └── By Work-Life Balance
│   ├── Search
│   └── Sort (Salary/Popularity/Name)
│
├── 📄 [Role Detail Page] (Dynamic)
│   ├── Overview
│   │   ├── Description
│   │   ├── Key Stats (Salary, Learning Time, Stress, Difficulty)
│   │   └── Job Titles
│   │
│   ├── ▼ Skills Required
│   │   ├── Programming Languages
│   │   ├── Frameworks & Tools
│   │   ├── Core Concepts
│   │   └── Soft Skills
│   │
│   ├── ▼ What You'll Do Daily
│   │   ├── Daily Tasks (7-8 items)
│   │   └── Work Environment
│   │
│   ├── ▼ Career Progression
│   │   ├── Timeline (0-2, 3-6, 7-10 years)
│   │   ├── Salary Growth Chart
│   │   ├── Career Tracks (Leadership/IC)
│   │   └── Alternative Paths
│   │
│   ├── ▼ Is This For You?
│   │   ├── Personality Fit (Thrive If / Avoid If)
│   │   ├── Stress Level Breakdown
│   │   └── Learning Curve
│   │
│   ├── ▼ College Roadmap
│   │   ├── Year 1 Goals
│   │   ├── Year 2 Goals
│   │   ├── Year 3 Goals (+ Internship)
│   │   └── Year 4 Goals (+ Placement)
│   │
│   ├── ▼ First Job Strategy
│   │   ├── Technical Prep Checklist
│   │   ├── Application Channels
│   │   ├── Interview Topics
│   │   └── Differentiators
│   │
│   └── Actions
│       ├── Add to Compare
│       ├── Add to Favorites
│       ├── Download PDF
│       └── Share
│
├── ⚖️ Compare Roles
│   ├── Role Selection (2-3 max)
│   ├── Comparison Table
│   │   ├── Salary (Fresher/3yr/5yr)
│   │   ├── Skills Required
│   │   ├── Learning Curve
│   │   ├── Stress Level
│   │   ├── Personality Fit
│   │   └── Daily Work
│   ├── Smart Insights
│   ├── Bottom Line Summary
│   └── Actions
│       ├── Download Comparison
│       ├── Share Comparison
│       └── Choose Role
│
├── 🎯 Personality Quiz
│   ├── Quiz Intro
│   ├── Questions (10-12)
│   │   ├── Work Style Preferences
│   │   ├── Stress Tolerance
│   │   ├── Learning Preferences
│   │   ├── Team vs Solo
│   │   ├── Salary vs Passion
│   │   └── Technical Depth
│   ├── Results Page
│   │   ├── Top 3 Recommended Roles
│   │   ├── Match Scores (%)
│   │   ├── Why It Fits You
│   │   └── Not Recommended (expandable)
│   └── Actions
│       ├── View Role Details
│       ├── Share Results
│       └── Retake Quiz
│
├── 📅 My Roadmap (Personalized)
│   ├── Roadmap Header
│   │   ├── Selected Role
│   │   ├── Current Year
│   │   ├── Skill Level
│   │   └── Progress (%)
│   ├── Timeline
│   │   ├── Year 1 (Past/Collapsed)
│   │   ├── Year 2 (Current/Expanded)
│   │   ├── Year 3 (Future/Collapsed)
│   │   └── Year 4 (Future/Collapsed)
│   ├── Goals (per year)
│   │   ├── Goal Checkbox
│   │   ├── Goal Description
│   │   ├── Resources
│   │   └── Success Criteria
│   ├── Progress Tracking
│   │   ├── Progress Bar
│   │   ├── Milestones
│   │   ├── Badges
│   │   └── Streaks
│   └── Actions
│       ├── Download PDF
│       ├── Share Progress
│       └── Edit Preferences
│
├── ❤️ Favorites (Future)
│   ├── Saved Roles
│   └── Saved Comparisons
│
├── ℹ️ About
│   ├── How It Works
│   ├── Data Sources
│   ├── Methodology
│   └── Team
│
├── 📚 Resources (Future)
│   ├── Learning Resources
│   ├── Success Stories
│   ├── Blog/Articles
│   └── Community
│
└── ⚙️ Settings (Future)
    ├── Profile
    ├── Preferences
    ├── Notifications
    └── Privacy
```

---

## Page Hierarchy & Importance

### Level 1: Core Pages (Must-have for MVP)
1. **Home** - First impression, conversion
2. **Browse Roles** - Discovery
3. **Role Detail** - Information
4. **Compare Roles** - Decision making
5. **Personality Quiz** - Personalization
6. **My Roadmap** - Action planning

### Level 2: Supporting Pages
7. **About** - Trust & credibility
8. **Resources** - Additional value
9. **Favorites** - Convenience

### Level 3: Future Enhancements
10. **User Profile** - Personalization
11. **Community** - Engagement
12. **Blog** - SEO & content marketing

---

## Content Depth by Page

### Shallow Pages (Quick Scan)
- **Home:** 30 seconds to understand value
- **Browse:** 1-2 minutes to find interesting role
- **Compare:** 2-3 minutes to see differences

### Medium Pages (5-10 minutes)
- **Role Detail:** 5-8 minutes to read key sections
- **Quiz:** 3-5 minutes to complete
- **Results:** 2-3 minutes to review matches

### Deep Pages (Ongoing Engagement)
- **Roadmap:** 10+ minutes initial setup, ongoing tracking
- **Resources:** Browse as needed

---

## URL Structure

### Primary Pages
```
/                          → Home
/browse                    → Browse all roles
/browse?category=software  → Filtered browse
/quiz                      → Personality quiz
/quiz/results              → Quiz results
/compare                   → Comparison tool
/roadmap                   → Personalized roadmap
```

### Dynamic Pages
```
/role/frontend-developer         → Role detail
/role/data-analyst              → Role detail
/role/[roleId]                  → Dynamic route
```

### Secondary Pages
```
/about                     → About the app
/resources                 → Learning resources
/favorites                 → Saved roles
/settings                  → User preferences
```

---

## Navigation Depth Rules

### Maximum 3 Clicks to Any Content
```
Home → Browse → Role Detail        (2 clicks)
Home → Quiz → Results → Role       (3 clicks)
Home → Compare → Role Detail       (2 clicks)
```

### No Dead Ends
Every page must have:
- ✅ Way to go back
- ✅ Way to move forward
- ✅ Way to access primary navigation

---

## Search & Discovery Paths

### Path 1: Browse-First User
```
Home → Browse → Role Detail → Compare → Roadmap
```

### Path 2: Quiz-First User
```
Home → Quiz → Results → Role Detail → Roadmap
```

### Path 3: Direct Search User
```
Home → Search "Frontend" → Role Detail → Roadmap
```

### Path 4: Comparison-Driven User
```
Home → Browse → Select 2 roles → Compare → Role Detail → Roadmap
```

---

## Information Scent (Breadcrumbs)

### Show User Location
```
Home / Browse / Frontend Developer
Home / Quiz / Results
Home / Compare / Frontend vs Backend
Home / My Roadmap / Backend Development
```

### Always Visible
- Current page name
- Path to get here
- Quick nav to key sections

---

## Content Organization Principles

### 1. Progressive Disclosure
- **Summary first** (above fold)
- **Details on demand** (expandable sections)
- **Deep dive optional** (links to resources)

### 2. Consistent Patterns
- All role pages use same structure
- All comparison tables use same layout
- All quizzes use same flow

### 3. Visual Hierarchy
- **H1:** Page title (1 per page)
- **H2:** Major sections (Skills, Career, etc.)
- **H3:** Subsections (Programming Languages, Frameworks)
- **Body:** Details, descriptions, lists

### 4. Scannable Content
- Bullet points over paragraphs
- Icons for visual scanning
- Color coding (green/yellow/red)
- White space between sections

---

## Mobile vs Desktop IA Differences

### Mobile (Bottom Tab Bar)
```
┌─────────────────────────────┐
│        Content              │
├─────────────────────────────┤
│ 🏠   🔍   ⚖️   👤          │
│Home Browse Compare  Roadmap │
└─────────────────────────────┘
```

### Desktop (Top Horizontal Nav)
```
┌─────────────────────────────┐
│ Logo | Home | Browse | Compare | Quiz | Roadmap | About │
├─────────────────────────────┤
│                             │
│        Content              │
```

### Hamburger Menu (Both)
- About
- Resources
- Favorites
- Settings
- Contact

---

## Related Pages & Cross-Links

### On Role Detail Page:
- "Similar Roles:" Frontend → Full-Stack, UI/UX
- "Compare with:" Backend, Data Analyst
- "You might also like:" Based on browsing history

### On Compare Page:
- "Popular Comparisons:" Frontend vs Backend, Data Analyst vs Data Scientist
- "Add another role:" Browse all roles

### On Roadmap Page:
- "Switch role:" Browse other roles
- "Resources for Year 2:" Link to learning resources

---

## Search Architecture

### Search Scope
```
All Roles (Primary)
├── Role Names (Frontend, Backend, etc.)
├── Synonyms (UI Developer → Frontend)
├── Skills (React → Frontend, Full-Stack)
└── Companies (Google, Amazon → All roles)
```

### Search Results
- **Roles** (primary results)
- **Skills** ("Learn React" → Frontend, Full-Stack roles)
- **Companies** ("Amazon hiring" → All roles with Amazon listed)

---

## Filters & Faceted Navigation

### Filter Categories
1. **Category** (Software, Data, Cloud, Security, Product)
2. **Salary** (High >12L, Medium 6-12L, Entry <6L)
3. **Difficulty** (Easy, Moderate, Hard)
4. **Work-Life Balance** (Good, Moderate, Demanding)

### Applied Filters
```
Active: [Software ×] [Easy ×]
Results: 4 roles (Frontend, QA, Technical Writer, UI/UX)
```

---

## Future IA Enhancements

### V2 Features
- **User Accounts** → Personal dashboard
- **Community Forum** → Q&A, discussions
- **Learning Paths** → Integrated courses
- **Job Board** → Real job listings

### V3 Features
- **Mentor Matching** → Connect with seniors
- **Portfolio Builder** → Showcase projects
- **Mock Interviews** → Practice platform
- **Success Network** → Alumni connections

---

**Next:** See [Navigation Patterns](./navigation.md) for detailed navigation design
