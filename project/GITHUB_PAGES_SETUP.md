# GitHub Pages Setup Guide

## If the Save Button is Greyed Out

This usually happens for one of these reasons:

### 1. Check Repository Visibility
- Your repository must be **public** for GitHub Pages to work with a free account
- If your repo is private, you need GitHub Pro/Team/Enterprise

### 2. Verify You Have the Right Permissions
- You must be the repository owner or have admin access
- If this is a forked repository, you might not have the right permissions

### 3. Check Branch Selection
Try these steps in order:

**Option A: Use GitHub Actions (Recommended)**
1. Go to your repository Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select **"GitHub Actions"** instead of "Deploy from a branch"
4. This should enable the save button

**Option B: Create a gh-pages branch**
1. In your repository, click the branch dropdown (currently shows "main")
2. Type "gh-pages" and click "Create branch: gh-pages"
3. Go back to Settings > Pages
4. Under "Source", select "Deploy from a branch"
5. Choose "gh-pages" branch and "/ (root)" folder
6. Click Save

### 4. Alternative: Use GitHub Actions Workflow
If the above doesn't work, we can set up automatic deployment:

1. In your repository, create `.github/workflows/deploy.yml`
2. Add the deployment workflow (see below)
3. Push the changes
4. GitHub will automatically deploy your site

## Quick Fix: Enable GitHub Actions Deployment

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. You should see a "Configure" button for "Static HTML" - click it
6. This will create a workflow file automatically
7. Commit the workflow file

Your site will then be available at:
`https://[your-username].github.io/bang-bang-game/`

## If You Still Have Issues

1. **Check repository name**: Make sure it's exactly "bang-bang-game"
2. **Verify files are in main branch**: The built files should be in your main branch
3. **Wait a few minutes**: GitHub Pages can take 5-10 minutes to deploy
4. **Check Actions tab**: Look for any deployment errors in the Actions tab

## Manual Deployment Workflow

If you want to set up the workflow manually, create this file:
`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

This will automatically build and deploy your site whenever you push to the main branch.