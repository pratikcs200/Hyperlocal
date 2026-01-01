# Deployment Guide

This guide provides detailed instructions for deploying the Hyperlocal Community Marketplace to various platforms.

## 🚀 Quick Deploy Options

### 1. Heroku (Recommended for beginners)

**Prerequisites:**
- Heroku account
- Git installed
- Heroku CLI installed

**Steps:**

1. **Install Heroku CLI**
   ```bash
   # Windows (using chocolatey)
   choco install heroku-cli
   
   # macOS (using homebrew)
   brew tap heroku/brew && brew install heroku
   
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-marketplace-app
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/marketplace"
   heroku config:set JWT_SECRET="your-secure-jwt-secret"
   heroku config:set NODE_ENV=production
   heroku config:set DEFAULT_RADIUS_KM=10
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

5. **Seed Database**
   ```bash
   heroku run npm run seed
   ```

6. **Open App**
   ```bash
   heroku open
   ```

### 2. Railway

**Steps:**

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment Variables**
   - Go to your project dashboard
   - Click "Variables" tab
   - Add:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: production
     - `DEFAULT_RADIUS_KM`: 10

3. **Deploy**
   - Railway automatically deploys on git push
   - Get your app URL from the dashboard

### 3. DigitalOcean App Platform

**Steps:**

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Environment: Node.js

3. **Set Environment Variables**
   - Add the same variables as above in the app settings

4. **Deploy**
   - App deploys automatically with SSL certificate

### 4. Vercel (For static hosting with serverless functions)

**Note:** Requires modification for serverless architecture

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure**
   ```bash
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   ```

## 🖥️ VPS Deployment (Ubuntu)

### Prerequisites
- Ubuntu 20.04+ server
- Domain name (optional)
- SSH access

### Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2, Nginx
   sudo npm install -g pm2
   sudo apt install nginx -y
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/02fe23bcs200-creator/Hyperlocal-community-market-place.git
   cd Hyperlocal-community-market-place
   
   # Install dependencies
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

3. **Start with PM2**
   ```bash
   # Start application
   pm2 start server.js --name "marketplace"
   
   # Save PM2 configuration
   pm2 startup
   pm2 save
   
   # Check status
   pm2 status
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/marketplace
   ```
   
   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       location / {
           proxy_pass http://localhost:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL Certificate (Optional)**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## 🔧 Environment Variables

Make sure to set these environment variables in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secure-random-string` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (usually auto-set) | `4000` |
| `DEFAULT_RADIUS_KM` | Default search radius | `10` |

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with read/write permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployments)
- [ ] Environment variables set correctly
- [ ] `.env` file not committed to repository
- [ ] `uploads/` directory exists
- [ ] All dependencies listed in `package.json`

## 🔍 Post-Deployment Testing

1. **Basic Functionality**
   - [ ] Application loads without errors
   - [ ] User registration works
   - [ ] User login works
   - [ ] Database connection successful

2. **Features Testing**
   - [ ] Create new listing
   - [ ] Upload images
   - [ ] Location-based search
   - [ ] Shopping cart functionality
   - [ ] Admin panel access

3. **Performance**
   - [ ] Page load times acceptable
   - [ ] Image uploads work
   - [ ] Mobile responsiveness
   - [ ] HTTPS enabled (for geolocation)

## 🐛 Common Deployment Issues

### MongoDB Connection Issues
```bash
# Check if IP is whitelisted
# Verify connection string format
# Ensure database user has correct permissions
```

### File Upload Issues
```bash
# Ensure uploads directory exists and is writable
mkdir -p uploads
chmod 755 uploads
```

### Port Issues
```bash
# Check if port is available
sudo netstat -tlnp | grep :4000

# Kill process if needed
sudo kill -9 $(sudo lsof -t -i:4000)
```

### SSL/HTTPS Issues
```bash
# For geolocation to work, HTTPS is required
# Use Let's Encrypt for free SSL certificates
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring

### PM2 Monitoring (VPS)
```bash
# View logs
pm2 logs marketplace

# Monitor resources
pm2 monit

# Restart application
pm2 restart marketplace
```

### Heroku Monitoring
```bash
# View logs
heroku logs --tail

# Check dyno status
heroku ps

# Restart application
heroku restart
```

## 🔄 Updates and Maintenance

### Updating Application
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart application
pm2 restart marketplace  # For VPS
# or
git push heroku main      # For Heroku
```

### Database Maintenance
```bash
# Backup database (MongoDB Atlas)
# Use MongoDB Compass or mongodump

# Update seed data if needed
npm run seed
```

## 📞 Support

If you encounter issues during deployment:

1. Check the application logs
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings
5. Review platform-specific documentation

For platform-specific help:
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Railway Documentation](https://docs.railway.app/)
- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [Vercel Documentation](https://vercel.com/docs)