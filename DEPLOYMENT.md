# GitHub Pages Deployment Guide

## Quick Setup Instructions

### 1. Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it something like `tealium-test-site` 
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we already have files)

### 2. Upload Your Files
You can either:

**Option A: Upload via GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all files from your local folder:
   - `index.html`
   - `products.html`
   - `cart.html` 
   - `search.html`
   - `consent.html`
   - `login.html`
   - `styles.css`
   - `tracking.js`
   - `README.md`
   - `.nojekyll`
3. Commit the files

**Option B: Use Git Commands**
```bash
git init
git add .
git commit -m "Initial commit - Tealium test site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository → Settings
2. Scroll down to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click Save

### 4. Access Your Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- It may take 5-10 minutes to deploy initially

### 5. Test Tealium Tracking
Once deployed:
1. Open browser console on your live site
2. Run: `document.cookie="utagdb=true";`
3. Refresh the page
4. Run: `TealiumTracker.testEventFiring();`
5. Look for "trigger: view" and "trigger: link" messages

## Important Notes
- The `.nojekyll` file prevents Jekyll processing issues
- All files are in root directory (no special folders)
- Tealium requires HTTPS (GitHub Pages provides this automatically)
- Changes may take a few minutes to appear due to caching

## Troubleshooting
- If JavaScript doesn't work, check browser console for errors
- If no events fire, verify Tealium account/profile settings
- Clear browser cache if you see old content 