# GitHub Setup Guide

Follow these steps to push your project to your GitHub account.

## 📋 Prerequisites

1. **Install Git**
   - **Windows**: Download from [git-scm.com](https://git-scm.com/download/win)
   - **macOS**: `brew install git` or download from git-scm.com
   - **Linux**: `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (CentOS/RHEL)

2. **GitHub Account**
   - Make sure you have access to your GitHub account
   - Create a new repository for this project

## 🚀 Step-by-Step Instructions

### 1. Create New Repository on GitHub

1. Go to [github.com](https://github.com) and login to your account
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in repository details:
   - **Repository name**: `hyperlocal-community-marketplace` (or your preferred name)
   - **Description**: `A responsive local marketplace web application for buying/selling items and services`
   - **Visibility**: Public (recommended) or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these files)
5. Click "Create repository"
6. **Copy the repository URL** (it will look like: `https://github.com/YOUR-USERNAME/REPOSITORY-NAME.git`)

### 2. Install Git (if not already installed)

**Windows:**
1. Download Git from https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt

**Verify Installation:**
```bash
git --version
```

### 3. Configure Git for Your Account

```bash
# Set your GitHub username and email
git config --global user.name "Your GitHub Username"
git config --global user.email "your.github.email@example.com"

# Verify configuration
git config --global --list
```

### 4. Initialize Repository and Add Files

Open terminal/command prompt in your project directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Hyperlocal Community Marketplace with responsive design and notifications"
```

### 5. Connect to Your GitHub Repository

```bash
# Add your repository as remote origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git

# Replace YOUR-USERNAME and YOUR-REPOSITORY-NAME with your actual values
# Example: git remote add origin https://github.com/johndoe/hyperlocal-marketplace.git

# Verify remote was added correctly
git remote -v
```

### 6. Push to GitHub

```bash
# Set main branch and push
git branch -M main
git push -u origin main
```

## 🔐 Authentication Options

If you encounter authentication issues, choose one of these methods:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Hyperlocal Marketplace"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. When Git asks for password, use the token instead

### Option B: GitHub CLI
```bash
# Install GitHub CLI first (https://cli.github.com/)
# Then authenticate
gh auth login

# Follow the prompts to authenticate with your account
```

### Option C: SSH Key (Advanced)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to GitHub
cat ~/.ssh/id_ed25519.pub

# Use SSH URL instead
git remote set-url origin git@github.com:YOUR-USERNAME/YOUR-REPOSITORY-NAME.git
```

## 📝 Example Commands with Your Repository

Replace these placeholders with your actual information:

```bash
# Example for user "johndoe" with repository "my-marketplace"
git remote add origin https://github.com/johndoe/my-marketplace.git
git push -u origin main
```

## 📁 Repository Structure

After pushing, your GitHub repository will contain:

```
your-repository-name/
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment template
├── README.md                     # Main documentation
├── DEPLOYMENT.md                 # Deployment guide
├── GITHUB_SETUP.md              # This setup guide
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
- ✅ Secure JWT secret already generated

## 🚀 Next Steps After Pushing

1. **Verify Repository**
   - Visit your repository URL on GitHub
   - Check all files are present
   - Verify README displays correctly

2. **Update Repository Settings**
   - Add repository description and topics
   - Set up branch protection rules if needed
   - Enable Issues and Discussions if desired

3. **Deploy Application**
   - Follow instructions in `DEPLOYMENT.md`
   - Use Heroku, Railway, or other platforms
   - Set up environment variables

4. **Update README (Optional)**
   - Replace any references to the old repository
   - Add your GitHub username to clone instructions
   - Customize as needed

## 🔄 Making Future Updates

After initial push, use these commands for updates:

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

## 🐛 Troubleshooting

### Git Not Recognized
- Ensure Git is installed and added to PATH
- Restart terminal after installation
- Try `git --version` to verify

### Authentication Issues
- Use Personal Access Token instead of password
- Make sure token has correct permissions
- Try GitHub CLI: `gh auth login`

### Repository Not Found
- Verify repository URL is correct
- Check repository name and username spelling
- Ensure repository exists on GitHub

### Permission Denied
- Check if you're logged into correct GitHub account
- Verify repository permissions
- Try using HTTPS instead of SSH (or vice versa)

## 📞 Support

If you encounter issues:
1. Double-check repository URL and credentials
2. Verify Git configuration with `git config --global --list`
3. Try creating a simple test repository first
4. Check GitHub's documentation for authentication

**Quick Reference Commands:**
```bash
# Check current remote
git remote -v

# Change remote URL if needed
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Check Git configuration
git config --global --list

# View commit history
git log --oneline

# Check repository status
git status
```

## 🎯 Ready to Deploy

Once pushed to GitHub, your repository will be ready for:
- ✅ Heroku deployment
- ✅ Railway deployment  
- ✅ DigitalOcean App Platform
- ✅ VPS deployment
- ✅ Portfolio showcase
- ✅ Collaboration with others

Follow the `DEPLOYMENT.md` guide for detailed deployment instructions!