# Design Tokens

> **Design system tokens for colors, typography, spacing, and more**

---

## 🎨 Color Palette

### Primary Colors
```css
--color-primary-50:  #eff6ff;  /* Lightest blue */
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Primary brand */
--color-primary-600: #2563eb;  /* Primary hover */
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
```

**Usage:**
- Primary buttons, links, active states
- Primary CTA: "Take Quiz", "Create Roadmap"
- Progress bars, loading states

---

### Secondary Colors
```css
--color-secondary-50:  #f5f3ff;  /* Lightest purple */
--color-secondary-100: #ede9fe;
--color-secondary-200: #ddd6fe;
--color-secondary-300: #c4b5fd;
--color-secondary-400: #a78bfa;
--color-secondary-500: #8b5cf6;  /* Secondary brand */
--color-secondary-600: #7c3aed;  /* Secondary hover */
--color-secondary-700: #6d28d9;
--color-secondary-800: #5b21b6;
--color-secondary-900: #4c1d95;
```

**Usage:**
- Secondary buttons, accents
- Badges, tags
- Quiz progress, gamification elements

---

### Neutral/Gray Scale
```css
--color-gray-50:  #f9fafb;  /* Backgrounds */
--color-gray-100: #f3f4f6;  /* Light backgrounds */
--color-gray-200: #e5e7eb;  /* Borders */
--color-gray-300: #d1d5db;  /* Disabled states */
--color-gray-400: #9ca3af;  /* Placeholder text */
--color-gray-500: #6b7280;  /* Secondary text */
--color-gray-600: #4b5563;  /* Primary text (light bg) */
--color-gray-700: #374151;  /* Headings */
--color-gray-800: #1f2937;  /* Dark text */
--color-gray-900: #111827;  /* Darkest text */
```

**Usage:**
- Text colors (600-900)
- Backgrounds (50-200)
- Borders (200-300)
- Disabled states (300-400)

---

### Semantic Colors

#### Success (Green)
```css
--color-success-50:  #f0fdf4;
--color-success-100: #dcfce7;
--color-success-500: #22c55e;  /* Main success */
--color-success-600: #16a34a;  /* Success hover */
--color-success-700: #15803d;
```
**Usage:** Completed goals, positive feedback, "Easy" difficulty, good work-life balance

#### Warning (Yellow/Orange)
```css
--color-warning-50:  #fffbeb;
--color-warning-100: #fef3c7;
--color-warning-500: #f59e0b;  /* Main warning */
--color-warning-600: #d97706;  /* Warning hover */
--color-warning-700: #b45309;
```
**Usage:** "Moderate" difficulty, medium stress level, caution messages

#### Error/Danger (Red)
```css
--color-error-50:  #fef2f2;
--color-error-100: #fee2e2;
--color-error-500: #ef4444;  /* Main error */
--color-error-600: #dc2626;  /* Error hover */
--color-error-700: #b91c1c;
```
**Usage:** "Hard" difficulty, high stress, error messages, "Avoid if" warnings

#### Info (Blue)
```css
--color-info-50:  #eff6ff;
--color-info-100: #dbeafe;
--color-info-500: #3b82f6;  /* Main info */
--color-info-600: #2563eb;  /* Info hover */
--color-info-700: #1d4ed8;
```
**Usage:** Info messages, tooltips, hints

---

### Background Colors
```css
--bg-primary:   #ffffff;  /* Main background */
--bg-secondary: #f9fafb;  /* Alternate sections */
--bg-tertiary:  #f3f4f6;  /* Cards, panels */
--bg-overlay:   rgba(0, 0, 0, 0.5);  /* Modal backdrop */
```

---

### Text Colors
```css
--text-primary:   #1f2937;  /* Headings, primary text */
--text-secondary: #6b7280;  /* Body text, descriptions */
--text-tertiary:  #9ca3af;  /* Metadata, captions */
--text-inverse:   #ffffff;  /* Text on dark backgrounds */
--text-link:      #2563eb;  /* Links */
--text-link-hover: #1d4ed8;  /* Link hover */
```

---

## 📏 Spacing Scale

### Base Scale (4px grid)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Usage Examples
```css
/* Between UI elements */
gap: var(--space-4);  /* 16px between items */

/* Card padding */
padding: var(--space-6);  /* 24px */

/* Section spacing */
margin-bottom: var(--space-12);  /* 48px */

/* Page margins */
padding: var(--space-4);  /* 16px on mobile */
padding: var(--space-8);  /* 32px on desktop */
```

---

## 🔤 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### Font Sizes (Mobile First)
```css
/* Mobile */
--text-xs:   0.75rem;   /* 12px - Metadata, captions */
--text-sm:   0.875rem;  /* 14px - Small text, labels */
--text-base: 1rem;      /* 16px - Body text */
--text-lg:   1.125rem;  /* 18px - Large body text */
--text-xl:   1.25rem;   /* 20px - Subheadings */
--text-2xl:  1.5rem;    /* 24px - H3 */
--text-3xl:  1.875rem;  /* 30px - H2 */
--text-4xl:  2.25rem;   /* 36px - H1 */
--text-5xl:  3rem;      /* 48px - Hero headings */

/* Desktop (scale up) */
--text-base: 1.125rem;  /* 18px on desktop */
--text-lg:   1.25rem;   /* 20px on desktop */
--text-xl:   1.5rem;    /* 24px on desktop */
```

### Font Weights
```css
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
```

### Line Heights
```css
--leading-none:   1;
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose:  2;
```

### Usage Examples
```css
/* H1 - Page Titles */
font-size: var(--text-4xl);
font-weight: var(--font-bold);
line-height: var(--leading-tight);

/* H2 - Section Headers */
font-size: var(--text-3xl);
font-weight: var(--font-semibold);
line-height: var(--leading-snug);

/* Body Text */
font-size: var(--text-base);
font-weight: var(--font-normal);
line-height: var(--leading-normal);

/* Small Text */
font-size: var(--text-sm);
font-weight: var(--font-normal);
line-height: var(--leading-normal);
```

---

## 📐 Border Radius

```css
--radius-none: 0;
--radius-sm:   0.125rem;  /* 2px - Subtle */
--radius-base: 0.25rem;   /* 4px - Default */
--radius-md:   0.375rem;  /* 6px - Cards */
--radius-lg:   0.5rem;    /* 8px - Buttons */
--radius-xl:   0.75rem;   /* 12px - Large cards */
--radius-2xl:  1rem;      /* 16px - Modal */
--radius-full: 9999px;    /* Fully rounded (pills, avatars) */
```

### Usage
```css
/* Buttons */
border-radius: var(--radius-lg);

/* Cards */
border-radius: var(--radius-xl);

/* Pills/Badges */
border-radius: var(--radius-full);
```

---

## 🎭 Shadows

```css
--shadow-sm:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Usage
```css
/* Cards (default) */
box-shadow: var(--shadow-base);

/* Cards (hover) */
box-shadow: var(--shadow-lg);

/* Modals */
box-shadow: var(--shadow-2xl);

/* Floating Action Button */
box-shadow: var(--shadow-xl);
```

---

## ⏱️ Transitions & Animations

### Duration
```css
--duration-fast:   150ms;
--duration-base:   200ms;
--duration-medium: 300ms;
--duration-slow:   500ms;
```

### Easing Functions
```css
--ease-linear:     linear;
--ease-in:         cubic-bezier(0.4, 0, 1, 1);
--ease-out:        cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:     cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Usage
```css
/* Button hover */
transition: all var(--duration-fast) var(--ease-out);

/* Modal open/close */
transition: opacity var(--duration-medium) var(--ease-in-out),
            transform var(--duration-medium) var(--ease-in-out);

/* Bounce effect (badges, confetti) */
animation: bounce var(--duration-slow) var(--ease-bounce);
```

---

## 📱 Breakpoints

```css
--screen-sm:  640px;   /* Small tablets */
--screen-md:  768px;   /* Tablets */
--screen-lg:  1024px;  /* Desktop */
--screen-xl:  1280px;  /* Large desktop */
--screen-2xl: 1536px;  /* Extra large */
```

### Media Queries
```css
/* Mobile first approach */
.container {
  padding: var(--space-4);  /* 16px on mobile */
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-8);  /* 32px on tablet+ */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-12);  /* 48px on desktop */
  }
}
```

---

## 🎯 Z-Index Scale

```css
--z-base:     0;
--z-dropdown: 10;
--z-sticky:   20;
--z-fixed:    30;
--z-overlay:  40;
--z-modal:    50;
--z-popover:  60;
--z-toast:    70;
--z-tooltip:  80;
```

### Usage
```css
/* Sticky header */
z-index: var(--z-sticky);

/* Modal backdrop */
z-index: var(--z-overlay);

/* Modal content */
z-index: var(--z-modal);

/* Toast notifications */
z-index: var(--z-toast);
```

---

## 🔘 Interactive States

### Opacity
```css
--opacity-disabled: 0.5;
--opacity-hover:    0.8;
--opacity-overlay:  0.5;
```

### Focus Ring
```css
--ring-width:  3px;
--ring-color:  var(--color-primary-500);
--ring-offset: 2px;
```

### Usage
```css
/* Disabled button */
opacity: var(--opacity-disabled);
cursor: not-allowed;

/* Focus state */
button:focus {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: var(--ring-offset);
}

/* Hover state */
button:hover {
  opacity: var(--opacity-hover);
}
```

---

## 📊 Component-Specific Tokens

### Buttons
```css
--btn-height-sm:   2rem;    /* 32px */
--btn-height-base: 2.5rem;  /* 40px */
--btn-height-lg:   3rem;    /* 48px */

--btn-padding-x-sm:   1rem;    /* 16px */
--btn-padding-x-base: 1.5rem;  /* 24px */
--btn-padding-x-lg:   2rem;    /* 32px */
```

### Cards
```css
--card-padding:       var(--space-6);   /* 24px */
--card-radius:        var(--radius-xl); /* 12px */
--card-border-color:  var(--color-gray-200);
--card-shadow:        var(--shadow-base);
--card-shadow-hover:  var(--shadow-lg);
```

### Form Inputs
```css
--input-height:        2.75rem;  /* 44px - Touch friendly */
--input-padding-x:     1rem;     /* 16px */
--input-border-width:  1px;
--input-border-color:  var(--color-gray-300);
--input-border-focus:  var(--color-primary-500);
--input-radius:        var(--radius-lg);
```

### Progress Bars
```css
--progress-height:    0.5rem;  /* 8px */
--progress-bg:        var(--color-gray-200);
--progress-fill:      var(--color-primary-500);
--progress-radius:    var(--radius-full);
```

---

## 🎨 Semantic Color Usage

### Difficulty Levels
```css
--difficulty-easy:     var(--color-success-500);  /* Green */
--difficulty-moderate: var(--color-warning-500);  /* Orange */
--difficulty-hard:     var(--color-error-500);    /* Red */
```

### Stress Levels
```css
--stress-low:     var(--color-success-500);  /* Green */
--stress-medium:  var(--color-warning-500);  /* Orange */
--stress-high:    var(--color-error-500);    /* Red */
```

### Salary Indicators
```css
--salary-entry:  var(--color-warning-500);  /* Yellow/Orange */
--salary-medium: var(--color-info-500);     /* Blue */
--salary-high:   var(--color-success-500);  /* Green */
```

### Personality Match
```css
--match-excellent: var(--color-success-500);  /* 80-100% */
--match-good:      var(--color-info-500);     /* 60-80% */
--match-poor:      var(--color-error-500);    /* <60% */
```

---

## 📦 Usage in Code

### CSS Variables
```css
:root {
  /* Primary colors */
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;

  /* Spacing */
  --space-4: 1rem;
  --space-6: 1.5rem;

  /* Typography */
  --text-base: 1rem;
  --font-normal: 400;
  --leading-normal: 1.5;
}

/* Dark mode (future) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --text-primary: #f9fafb;
  }
}
```

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... rest
        },
      },
      spacing: {
        '1': '0.25rem',
        '4': '1rem',
        '6': '1.5rem',
        // ... rest
      },
    },
  },
}
```

### JavaScript/TypeScript
```typescript
// design-tokens.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
  },
  // ... rest
} as const;

export const spacing = {
  1: '0.25rem',
  4: '1rem',
  6: '1.5rem',
} as const;
```

---

## ✅ Design Token Checklist

When designing new components, ensure you use:
- ✅ Semantic colors (not hardcoded hex values)
- ✅ Spacing scale (4px grid)
- ✅ Typography scale (predefined sizes)
- ✅ Border radius scale
- ✅ Shadow scale
- ✅ Z-index scale
- ✅ Transition durations

---

**Next:** See [Component Library](./component-library.md) for component specifications using these tokens
