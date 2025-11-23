#!/bin/bash
# Setup script for B.Tech CS Career Guide India repository

echo "🎓 B.Tech CS Career Guide India - Repository Setup"
echo "=================================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -m main
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete B.Tech CS Career Paths Guide for India

Add comprehensive career guidance with 45+ career paths covering all major tech disciplines in India.

Content includes:
- 50,000+ word markdown guide
- 12-slide HTML presentation
- Detailed research reports
- Quick comparison tables
- Salary data (2024-2025)
- Learning roadmaps
- First job strategies

Data from 100+ sources, current as of November 2024.

License: MIT"

echo "✅ Initial commit created"
echo ""
echo "🚀 Next steps:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Name it: btech-cs-career-guide-india"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/btech-cs-career-guide-india.git"
echo "   git push -u origin main"
echo ""
echo "Or if using GitHub CLI:"
echo "   gh repo create btech-cs-career-guide-india --public --source=. --remote=origin"
echo "   git push -u origin main"
echo ""
echo "✨ Done! Your repository is ready to push to GitHub."
