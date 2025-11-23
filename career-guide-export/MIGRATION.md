# Migration Guide

This folder contains all files for the **B.Tech CS Career Guide India** project, ready to be moved to a separate repository.

## 📁 Contents

```
career-guide-export/
├── README.md                                    # Main README with overview
├── B.TECH_CAREER_PATHS_COMPLETE_GUIDE.md       # Full 50,000+ word guide
├── B.TECH_CAREER_PATHS_PRESENTATION.html       # 12-slide HTML presentation
├── CAREER_PATHS_RESEARCH_REPORT.md             # Detailed research data
├── LICENSE                                      # MIT License
├── .gitignore                                   # Git ignore rules
├── setup.sh                                     # Automated setup script
└── MIGRATION.md                                 # This file
```

## 🚀 Quick Migration (3 Methods)

### Method 1: Using the Setup Script (Easiest)

```bash
# Navigate to this folder
cd career-guide-export

# Run the setup script
./setup.sh

# Follow the instructions printed by the script
```

### Method 2: Manual Git Setup

```bash
# Navigate to this folder
cd career-guide-export

# Initialize git
git init
git branch -m main

# Add and commit files
git add .
git commit -m "Initial commit: Complete B.Tech CS Career Guide for India"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/btech-cs-career-guide-india.git
git push -u origin main
```

### Method 3: Using GitHub CLI (Fastest)

```bash
# Navigate to this folder
cd career-guide-export

# Initialize git
git init
git branch -m main
git add .
git commit -m "Initial commit: Complete B.Tech CS Career Guide for India"

# Create repo and push in one command
gh repo create btech-cs-career-guide-india --public --source=. --remote=origin --push
```

## ✅ Verification Checklist

After pushing, verify your repository has:

- [ ] README.md displays correctly on GitHub
- [ ] All 4 main content files are present
- [ ] LICENSE file is visible
- [ ] .gitignore is working
- [ ] No unnecessary files from the parent project

## 📝 Post-Migration Steps

1. **Add Topics** to your repository:
   - `career-guide`
   - `btech`
   - `computer-science`
   - `india`
   - `job-search`
   - `salary`

2. **Add Description**:
   ```
   Complete career paths guide for B.Tech CS graduates in India - 45+ roles with salaries, roadmaps, and strategies
   ```

3. **Enable GitHub Pages** (optional):
   - Settings → Pages → Source: main branch
   - The HTML presentation will be accessible online!

4. **Share it**:
   - With your college placement cell
   - On LinkedIn/Twitter
   - In tech communities

## 🧹 Cleanup (Optional)

After successful migration, you can remove this folder from the parent project:

```bash
# From the best-of-frontend directory
rm -rf career-guide-export/
```

## ❓ Troubleshooting

**"remote: Repository not found"**
- Make sure you created the repository on GitHub first
- Check the repository URL is correct

**"Permission denied (publickey)"**
- Use HTTPS instead of SSH: `https://github.com/...`
- Or setup GitHub CLI: `gh auth login`

**Files not showing up**
- Check .gitignore isn't excluding them
- Use `git status` to see what's tracked

## 📧 Questions?

If you encounter any issues, open an issue in the repository or refer to:
- [GitHub Docs - Creating a Repository](https://docs.github.com/en/get-started/quickstart/create-a-repo)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

---

**Good luck with your new repository! 🎉**
