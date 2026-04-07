#!/bin/bash
# Automated repo creation and deployment script

set -e

echo "🚀 Swiss Tax Optimizer 2026 - GitHub Deployment"
echo "================================================"
echo ""

# Check if repo already exists
if gh repo view marhenk/swiss-tax-optimizer-2026 &>/dev/null; then
    echo "✅ Repo already exists: https://github.com/marhenk/swiss-tax-optimizer-2026"
    REPO_EXISTS=true
else
    echo "❌ Repo does not exist yet"
    REPO_EXISTS=false
fi

if [ "$REPO_EXISTS" = false ]; then
    echo ""
    echo "📝 Manual Step Required:"
    echo "   1. Go to: https://github.com/new"
    echo "   2. Name: swiss-tax-optimizer-2026"
    echo "   3. Description: Swiss Tax Calculator & Optimizer for Kanton Bern 2026 — 100% accuracy, official tariffs, autoresearch-validated"
    echo "   4. Visibility: Public"
    echo "   5. DO NOT add README/License/.gitignore (already included)"
    echo "   6. Click 'Create repository'"
    echo ""
    read -p "Press ENTER once you've created the repo..."
fi

# Add remote if not exists
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Adding remote..."
    git remote add origin git@github.com:marhenk/swiss-tax-optimizer-2026.git
else
    echo "✅ Remote already configured"
fi

# Push
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "🌐 Next: Enable GitHub Pages"
echo "   1. Go to: https://github.com/marhenk/swiss-tax-optimizer-2026/settings/pages"
echo "   2. Source: Deploy from a branch"
echo "   3. Branch: main, Folder: /docs"
echo "   4. Click Save"
echo ""
echo "📊 Dashboard will be live at:"
echo "   https://marhenk.github.io/swiss-tax-optimizer-2026/"
echo ""
echo "⏱️  Takes ~1-2 minutes to deploy"
echo ""

read -p "Press ENTER once you've enabled Pages..."

echo ""
echo "🔍 Waiting for deployment..."
sleep 10

# Try to open the dashboard
if command -v xdg-open &>/dev/null; then
    echo "🌐 Opening dashboard..."
    xdg-open "https://marhenk.github.io/swiss-tax-optimizer-2026/" &
fi

echo ""
echo "✅ DEPLOYMENT COMPLETE"
echo ""
echo "📌 Repository: https://github.com/marhenk/swiss-tax-optimizer-2026"
echo "📊 Dashboard:  https://marhenk.github.io/swiss-tax-optimizer-2026/"
echo ""
