# B.Tech CS Career Guide India

A comprehensive career guidance platform for Indian B.Tech Computer Science and IT students, helping them explore 45+ tech career paths with real salary data, skill roadmaps, and personality-based recommendations.

## 🚀 Features

- **Browse 45+ Tech Roles** — Explore detailed career profiles across 11 categories including Software Engineering, Data/AI/ML, Cloud/DevOps, Security, and more
- **Interactive Quiz** — Take a personality-based quiz to discover career paths that match your interests and strengths
- **Compare Roles** — Side-by-side comparison of different career paths to make informed decisions
- **India-Focused Data** — Salary ranges, job market insights, and educational requirements specific to the Indian tech industry
- **Skill Roadmaps** — Clear learning paths with tools, technologies, and resources for each role

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn/ui (Radix primitives)
- **State Management**: Zustand with localStorage persistence
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/mnttnm/btech-cs-career-guide-india.git

# Navigate to the project
cd btech-cs-career-guide-india

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Suggest a New Role

If you'd like to recommend a new tech role that should be included in the guide:
1. Fork this repository
2. Add the role data following the existing schema in `src/data/roles/`
3. Submit a Pull Request with a description of the role and why it should be included

### Report Inaccuracies

Found something that's significantly wrong or outdated in the current representation of a role? We want to know!
- **For corrections**: Please raise a [Pull Request](https://github.com/mnttnm/btech-cs-career-guide-india/pulls) with the fix
- Include sources or references to support the correction

### Feature Requests & Suggestions

Have an idea to make this guide better?
- Open a [GitHub Issue](https://github.com/mnttnm/btech-cs-career-guide-india/issues) with the "feature request" label
- Describe your suggestion and how it would help students

### Bug Reports

If you encounter a bug:
1. Check if it's already reported in [Issues](https://github.com/mnttnm/btech-cs-career-guide-india/issues)
2. If not, create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # UI components (Shadcn/ui + custom)
├── data/          # Role JSON data + loader utilities
├── stores/        # Zustand state (favorites, comparison, quiz)
├── types/         # TypeScript interfaces
└── lib/           # Utilities
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for the Indian B.Tech student community.

---

**Questions?** Feel free to reach out or open an issue!
