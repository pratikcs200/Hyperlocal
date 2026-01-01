# GitHub Setup Guide

Follow these steps to push your project to GitHub.

## 📋 Prerequisites

1. **Install Git**
   - **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
   - **macOS**: `brew install git` or download from git-scm.com
   - **Linux**: `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

2. **GitHub Account**
   - Create account at [github.com](https://github.com) if you don't have one

## 🚀 Step-by-Step Instructions

### 1. Install Git (if not already installed)

**Windows:**
1. Download Git from https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt

**Verify Installation:**
```bash
git --version
```

### 2. Configure Git (First time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Initialize Repository and Add Files

Open terminal/command prompt in your project directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Hyperlocal Community Marketplace"
```

### 4. Connect to GitHub Repository

```bash
# Add remote repository
git remote add origin https://github.com/02fe23bcs200-creator/Hyperlocal-community-market-place.git

# Verify remote was added
git remote -v
```

### 5. Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

If you encounter authentication issues, you may need to:

**Option A: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with repo permissions
3. Use token as password when prompted

**Option B: Use GitHub CLI**
```bash
# Install GitHub CLI first
# Then authenticate
gh auth login
```

## 📁 Files Created for GitHub

The following files have been created to optimize your GitHub repository:

### `.gitignore`
- Excludes `node_modules/`, `.env`, logs, and other unnecessary files
- Keeps repository clean and secure

### `uploads/.gitkeep`
- Ensures the uploads directory is tracked by Git
- Required for file upload functionality

### Updated `README.md`
- Comprehensive documentation
- Installation and deployment instructions
- API documentation
- Troubleshooting guide

### `DEPLOYMENT.md`
- Detailed deployment instructions for multiple platforms
- Environment configuration
- Monitoring and maintenance guides

## 🔧 Repository Structure

After pushing, your GitHub repository will contain:

```
Hyperlocal-community-market-place/
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment template
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
├── GITHUB_SETUP.md              # This file
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Dependency lock file
├── server.js                     # Main server file
├── seed.js                       # Database seeding
├── controllers/                  # Route controllers
├── middleware/                   # Custom middleware
├── models/                       # Database models
├── routes/                       # API routes
├── public/                       # Frontend files
└── uploads/                      # File upload directory
    └── .gitkeep
```

## 🔒 Security Notes

- ✅ `.env` file is excluded from repository (contains secrets)
- ✅ `node_modules/` excluded (large dependency folder)
- ✅ Logs and temporary files excluded
- ✅ Only source code and documentation included

## 🚀 Next Steps After Pushing

1. **Verify Repository**
   - Visit: https://github.com/02fe23bcs200-creator/Hyperlocal-community-market-place
   - Check all files are present
   - Verify README displays correctly

2. **Set Up Repository Settings**
   - Add repository description
   - Add topics/tags for discoverability
   - Enable Issues and Discussions if needed

3. **Deploy Application**
   - Follow instructions in `DEPLOYMENT.md`
   - Use Heroku, Railway, or other platforms
   - Set up environment variables

4. **Share Repository**
   - Repository is now public and shareable
   - Others can clone and contribute
   - Perfect for portfolio showcase

## 🐛 Troubleshooting

### Git Not Recognized
- Ensure Git is installed and added to PATH
- Restart terminal after installation
- Try `git --version` to verify

### Authentication Issues
- Use Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`
- Ensure correct repository URL

### Permission Denied
- Check repository permissions
- Verify you're the owner or have write access
- Use correct GitHub username in URL

### Large File Issues
- Check if any files exceed GitHub's 100MB limit
- Use Git LFS for large files if needed
- Remove large files from history if necessary

## 📞 Support

If you encounter issues:
1. Check GitHub's documentation
2. Verify Git installation and configuration
3. Ensure repository permissions are correct
4. Try using GitHub Desktop as an alternative

**Useful Commands:**
```bash
# Check repository status
git status

# View commit history
git log --oneline

# Check remote repositories
git remote -v

# Pull latest changes
git pull origin main

# Push changes
git push origin main
```