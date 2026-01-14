# Clean Server Start - Complete Reset Guide

This guide will help you completely clean your DigitalOcean server and start fresh.

## ⚠️ WARNING

This will **DELETE** all your current code and data on the server. Make sure you have:

- ✅ Code pushed to GitHub (already done)
- ✅ Database backups (if using local MongoDB)
- ✅ Environment variables saved (copy from `.env` files)

## Step 1: Stop All Running Processes

```bash
# SSH into your server
ssh deploy@YOUR_SERVER_IP
# OR
ssh root@YOUR_SERVER_IP

# ⚠️ IMPORTANT: Stop Nginx first (it's likely causing high CPU)
sudo systemctl stop nginx

# Stop all PM2 processes
pm2 stop all
pm2 delete all

# Kill any remaining Node.js processes
pkill -f node
pkill -f next

# Kill any stuck nginx processes
sudo pkill -9 nginx

# Check if anything is still running
ps aux | grep node
ps aux | grep next
ps aux | grep nginx

# If processes are still running, force kill them
sudo pkill -9 node
sudo pkill -9 next
```

## Step 2: Remove Project Directory

```bash
# Navigate to home directory
cd ~

# Remove the entire project directory
rm -rf veda-scholars

# Verify it's gone
ls -la | grep veda
```

## Step 3: Clean Up System Resources

```bash
# Check current CPU and memory usage (should be low now)
top
# Press 'q' to quit
# CPU should be < 10% after stopping nginx

# Check memory usage
free -h
# Should show more free memory after cleanup

# Check disk usage
df -h

# Clean npm cache (if needed)
npm cache clean --force

# Remove any orphaned node_modules (if they exist elsewhere)
find /home -name "node_modules" -type d -prune -exec rm -rf '{}' + 2>/dev/null

# Clean system package cache (optional, saves space)
sudo apt clean
sudo apt autoremove -y

# Remove old nginx logs (they can grow large)
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log

# Clear system cache (frees up memory)
sudo sync
sudo sysctl vm.drop_caches=3
```

## Step 3.5: Set Up Swap Space (Recommended for 2GB RAM)

**⚠️ Important:** Your server has 2GB RAM and no swap. Adding swap will prevent out-of-memory crashes.

```bash
# Check current swap
free -h
# Should show Swap: 0B (no swap currently)

# Create 2GB swap file (matches your RAM size)
sudo fallocate -l 2G /swapfile

# Set correct permissions
sudo chmod 600 /swapfile

# Set up swap space
sudo mkswap /swapfile

# Enable swap
sudo swapon /swapfile

# Verify swap is active
free -h
# Should now show Swap: 2.0Gi

# Make swap permanent (survives reboots)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap usage (only use when RAM is 80% full)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

## Step 4: Verify System is Clean

```bash
# Check CPU usage (should be low now)
top
# Should show < 10% CPU usage

# Check memory (should have more free now)
free -h
# Should show more available memory after cleanup

# Check swap (should be active if you set it up)
free -h | grep Swap
# Should show Swap: 2.0Gi if swap was created

# ⚠️ IMPORTANT: Check what's using memory
ps aux --sort=-%mem | head -15
# This shows top memory-consuming processes

# Check if MongoDB is running (common memory hog)
ps aux | grep mongod
sudo systemctl status mongod

# Check system services using memory
systemctl list-units --type=service --state=running | grep -E "mongod|mysql|postgres|redis"

# Check running processes
ps aux | grep -E "node|next|pm2" | grep -v grep
# Should show nothing (or only system processes)

# Check ports
sudo netstat -tulpn | grep -E "3000|8483"
# Should show nothing (ports are free)

# Check disk space
df -h
# Should have enough free space for fresh install
```

## Step 4.5: Identify Memory Usage

**If memory is still high (1.3GB+) even with no code running:**

```bash
# 1. Check top memory consumers
ps aux --sort=-%mem | head -20

# 2. Check MongoDB (common culprit - can use 500MB-1GB)
ps aux | grep mongod
# If MongoDB is running, it's likely using significant memory

# 3. Check system cache (this is normal and can be freed)
free -h
# Look at "buff/cache" - this is Linux using free RAM for caching
# It will be freed automatically when needed

# 4. Check actual used memory (excluding cache)
free -h
# Look at "available" - this is what's truly available
# "used" includes cache, "available" is what you can actually use

# 5. If MongoDB is using too much, stop it (if not needed)
sudo systemctl stop mongod
# Or configure MongoDB to use less memory (see below)

# 6. Clear system cache (if needed)
sudo sync
sudo sysctl vm.drop_caches=3
free -h
# Should show more free memory
```

**Common Memory Users:**

- **MongoDB**: 500MB - 1GB (if running)
- **System cache**: 200-500MB (normal, auto-freed)
- **Nginx**: 5-20MB (if running)
- **System processes**: 100-200MB
- **Other services**: Varies

## Step 5: Fresh Installation

### Option A: Using deploy.sh (Recommended)

**⚠️ GitHub Authentication:** You need to authenticate with GitHub first.

**Option 1: Use SSH (Recommended - No password needed)**

```bash
# Check if you have SSH key
ls -la ~/.ssh/id_rsa.pub

# If no SSH key exists, generate one
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter to accept default location
# Press Enter twice for no passphrase (or set one)

# Copy public key
cat ~/.ssh/id_rsa.pub
# Copy the output and add it to GitHub: Settings > SSH and GPG keys > New SSH key

# Test SSH connection
ssh -T git@github.com
# Should say: "Hi SayedJamil! You've successfully authenticated..."

# Clone using SSH (no password needed)
cd ~
git clone git@github.com:SayedJamil/veda-scholars.git
cd veda-scholars
```

**Option 2: Use Personal Access Token (PAT)**

```bash
# Clone using HTTPS with PAT
cd ~
git clone https://github.com/SayedJamil/veda-scholars.git
# When prompted:
# Username: SayedJamil
# Password: <paste your Personal Access Token here>
#
# To create PAT: GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
# Permissions needed: repo (all)
```

**Option 3: Make Repository Public (if it's private)**

If the repository is private and you want to clone it without authentication issues, you can make it public temporarily or use one of the authentication methods above.

```bash
# Clone fresh repository (after authentication is set up)
cd ~
git clone https://github.com/SayedJamil/veda-scholars.git
cd veda-scholars

# Make deploy.sh executable
chmod +x deploy.sh

# Run deployment script (this will install everything)
./deploy.sh
```

### Option B: Manual Step-by-Step

```bash
# Clone fresh repository
cd ~
git clone https://github.com/SayedJamil/veda-scholars.git
cd veda-scholars

# Install all dependencies
npm run install:all

# Set up environment variables
# Backend
cp backend/env.template backend/.env
nano backend/.env
# Uncomment PRODUCTION section, comment out DEVELOPMENT section
# Update with your production values

# Frontend
cp frontend/env.template frontend/.env.local
nano frontend/.env.local
# Uncomment PRODUCTION section, comment out DEVELOPMENT section
# Update with your production values

# Build applications
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command that PM2 outputs
```

## Step 6: Configure Nginx (Fresh Configuration)

```bash
# Remove old nginx config (if it exists and was causing issues)
sudo rm -f /etc/nginx/sites-enabled/veda-scholars
sudo rm -f /etc/nginx/sites-available/veda-scholars

# Create fresh nginx config
sudo nano /etc/nginx/sites-available/veda-scholars
```

Add this **optimized** configuration (prevents high CPU):

```nginx
# Rate limiting to prevent abuse
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;

# Frontend (Next.js)
server {
    listen 80;
    server_name vedascholars.com www.vedascholars.com;

    # Client body size limit
    client_max_body_size 10M;

    # Timeouts to prevent hanging connections
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        limit_req zone=web_limit burst=20 nodelay;

        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Prevent hanging connections
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # Backend GraphQL API
    location /graphql {
        limit_req zone=api_limit burst=10 nodelay;

        proxy_pass http://localhost:8483/graphql;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for API
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Health check endpoint (no rate limit)
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/veda-scholars /etc/nginx/sites-enabled/

# Remove default nginx site (if it exists and conflicts)
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration (VERY IMPORTANT - catches errors before starting)
sudo nginx -t

# If test passes, start nginx
sudo systemctl start nginx

# Enable nginx to start on boot
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx

# Monitor nginx CPU usage
top -p $(pgrep nginx | tr '\n' ',' | sed 's/,$//')
# Should show < 5% CPU usage
```

## Step 7: Verify Everything is Working

```bash
# Check PM2 status
pm2 status
# Should show both veda-backend and veda-frontend as "online"

# Check PM2 logs
pm2 logs --lines 20

# Check CPU usage (should be normal now)
pm2 monit
# Should show < 50% CPU usage

# Test backend
curl http://localhost:8483/graphql -H "Content-Type: application/json" -d '{"query": "{ __typename }"}'

# Test frontend
curl http://localhost:3000
```

## Step 8: Monitor Resources

```bash
# Monitor in real-time
pm2 monit

# Check system resources
htop
# OR
top

# Check specific process CPU usage
ps aux --sort=-%cpu | head -10
```

## Troubleshooting

### If CPU is still high after fresh install:

```bash
# Check what's using CPU
top
# Press 'P' to sort by CPU

# If nginx is high, check nginx status
sudo systemctl status nginx
sudo nginx -t

# Check nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx

# Check PM2 processes
pm2 list
pm2 monit

# Check for memory leaks
pm2 logs --err

# Restart services
pm2 restart all
```

### If build fails:

```bash
# Clean install
cd ~/veda-scholars/frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

cd ../backend
rm -rf node_modules package-lock.json
npm install

# Try building again
cd ~/veda-scholars
npm run build
```

### If ports are in use:

```bash
# Find what's using the ports
sudo lsof -i :3000
sudo lsof -i :8483

# Kill the processes
sudo kill -9 <PID>
```

## Expected Results After Clean Start

- **CPU Usage**: < 30% (idle), < 50% (under load)
- **Memory Usage**: < 70% (with swap enabled)
- **Swap**: 2GB active (prevents OOM crashes)
- **PM2 Status**: Both services "online"
- **Nginx CPU**: < 5% (with optimized config)
- **Website**: Accessible at https://vedascholars.com
- **API**: Working at https://vedascholars.com/graphql

## Memory Optimization Tips for 2GB Server

Since you have a 2GB server, here are additional optimizations:

```bash
# 1. Limit PM2 memory usage (already in ecosystem.config.js)
# Backend: max_memory_restart: '800M'
# Frontend: max_memory_restart: '1.2G'

# 2. Optimize MongoDB (if using local MongoDB)
# MongoDB can use 50% of available RAM by default
# Limit it to 512MB for a 2GB server
sudo nano /etc/mongod.conf
```

Add this to MongoDB config:

```yaml
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5 # Limit to 512MB instead of default ~1GB
```

```bash
# Restart MongoDB
sudo systemctl restart mongod

# 3. Check what's using memory
ps aux --sort=-%mem | head -10

# 4. Monitor memory usage
pm2 monit
# Watch for memory leaks

# 5. If memory gets too high, restart services
pm2 restart all

# 6. Stop MongoDB if not using local MongoDB (use MongoDB Atlas instead)
sudo systemctl stop mongod
sudo systemctl disable mongod  # Prevents auto-start on boot
```

**Understanding Memory Usage:**

- **"used"** includes system cache (which is good - Linux uses free RAM for caching)
- **"available"** is what you can actually use
- **"buff/cache"** will be freed automatically when applications need memory
- **MongoDB** is often the biggest memory user (500MB-1GB) if running locally

**Recommended:** Consider upgrading to 4GB RAM droplet ($24/month) for better performance if you experience frequent memory issues.

## Quick Cleanup Script

If you want to automate the cleanup:

```bash
# Create cleanup script
nano ~/cleanup.sh
```

Add this:

```bash
#!/bin/bash

echo "🧹 Cleaning up server..."

# Stop Nginx first (likely causing high CPU)
sudo systemctl stop nginx
sudo pkill -9 nginx

# Stop PM2
pm2 stop all
pm2 delete all

# Kill Node processes
pkill -9 node
pkill -9 next

# Remove project
rm -rf ~/veda-scholars

# Clean npm cache
npm cache clean --force

# Clear nginx logs
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log

echo "✅ Cleanup complete!"
echo "📥 Now clone and deploy fresh:"
echo "   cd ~ && git clone https://github.com/SayedJamil/veda-scholars.git"
echo "   cd veda-scholars && ./deploy.sh"
```

Make it executable:

```bash
chmod +x ~/cleanup.sh
```

Run it:

```bash
~/cleanup.sh
```

---

**After cleanup, your server should be fresh and ready for a clean deployment!**
