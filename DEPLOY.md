# GitHub Deployment Instructions

The repository is ready to deploy. Follow these steps:

## Step 1: Create GitHub Repository

Since the current GitHub token doesn't have repo creation permissions, create the repo manually:

1. Go to https://github.com/new
2. Repository name: `swiss-tax-optimizer-2026`
3. Description: `Swiss Tax Calculator & Optimizer for Kanton Bern 2026 — 100% accuracy, official tariffs, autoresearch-validated`
4. Visibility: **Public**
5. DO NOT initialize with README, license, or .gitignore (already included)
6. Click "Create repository"

## Step 2: Push to GitHub

```bash
cd ~/swiss-tax-optimizer-2026

# Add remote
git remote add origin https://github.com/marhenk/swiss-tax-optimizer-2026.git

# Push
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to: https://github.com/marhenk/swiss-tax-optimizer-2026/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main** 
4. Folder: **/docs**
5. Click **Save**

GitHub will deploy the dashboard to:
**https://marhenk.github.io/swiss-tax-optimizer-2026/**

(Takes ~1-2 minutes)

## Step 4: Verify Deployment

After ~2 minutes:

```bash
# Open dashboard
xdg-open https://marhenk.github.io/swiss-tax-optimizer-2026/

# Or via gh CLI
gh browse --repo marhenk/swiss-tax-optimizer-2026 --pages
```

## Step 5: Update README Links (if needed)

If GitHub username is different from `marhenk`, update these links in README.md:

- Line 7: Dashboard URL
- Line 225: Repo URL in docs/README.md

Then commit:

```bash
git add README.md docs/README.md
git commit -m "Fix: Update GitHub URLs"
git push
```

## Verification Checklist

- [ ] Repo created at https://github.com/marhenk/swiss-tax-optimizer-2026
- [ ] All files pushed (35 files)
- [ ] GitHub Pages enabled (Settings → Pages → main branch, /docs folder)
- [ ] Dashboard accessible at https://marhenk.github.io/swiss-tax-optimizer-2026/
- [ ] Dashboard renders correctly (FT-style colors, tables, scores)
- [ ] README displays properly on repo homepage
- [ ] No personal data in public files

## Shareable URLs

Once deployed:

- **Repository:** https://github.com/marhenk/swiss-tax-optimizer-2026
- **Dashboard:** https://marhenk.github.io/swiss-tax-optimizer-2026/
- **Clone URL:** `git clone https://github.com/marhenk/swiss-tax-optimizer-2026.git`

---

**Note:** The repository is currently at `~/swiss-tax-optimizer-2026` and ready to push. All files are committed and staged.
