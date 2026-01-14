# Fresh Droplet Setup Guide - Veda Scholars

This guide walks you through setting up a brand new DigitalOcean droplet (or any Ubuntu server) from scratch without using deploy.sh.

## Table of Contents

- [Step 1: Create DigitalOcean Droplet](#step-1-create-digitalocean-droplet)
- [Step 2: Initial Server Setup](#step-2-initial-server-setup)
- [Step 3: Install Node.js](#step-3-install-nodejs)
- [Step 4: Install Git](#step-4-install-git)
- [Step 5: Install Nginx](#step-5-install-nginx)
- [Step 6: Install PM2](#step-6-install-pm2)
- [Step 7: Setup SSH Keys for Git](#step-7-setup-ssh-keys-for-git)
- [Step 8: Clone Repository](#step-8-clone-repository)
- [Step 9: Install Project Dependencies](#step-9-install-project-dependencies)
- [Step 10: Setup Environment Variables](#step-10-setup-environment-variables)
- [Step 11: Build Applications](#step-11-build-applications)
- [Step 12: Setup PM2](#step-12-setup-pm2)
- [Step 13: Configure Nginx](#step-13-configure-nginx)
- [Step 14: Configure Firewall](#step-14-configure-firewall)
- [Step 15: Setup SSL (Optional)](#step-15-setup-ssl-optional)
- [Step 16: Verify Everything is Working](#step-16-verify-everything-is-working)
- [Troubleshooting](#troubleshooting)

---

## Step 1: Create DigitalOcean Droplet

1. **Log in to DigitalOcean**

   - Go to https://cloud.digitalocean.com
   - Sign in to your account

2. **Create a New Droplet**

   - Click "Create" → "Droplets"
   - Choose configuration:
     - **Image**: Ubuntu 22.04 (LTS) x64 (recommended)
     - **Plan**: Basic plan (recommended: 2GB RAM / 1 vCPU for small-medium traffic)
     - **Datacenter region**: Choose closest to your users
     - **Authentication**: SSH keys (recommended) or root password
   - **Droplet hostname**: veda-scholars-production (or your preferred name)
   - Click "Create Droplet"

3. **Note Your Server IP**
   - Once created, note the IP address (e.g., `139.59.9.114`)
   - You'll need this to SSH into the server

---

## Step 2: Initial Server Setup

### Connect to Your Server

```bash
# If using root user (default for DigitalOcean)
ssh root@YOUR_SERVER_IP

# If using SSH keys and it's not working, try:
ssh -i ~/.ssh/your_private_key root@YOUR_SERVER_IP
```

**If SSH times out:**

- Check if firewall on your local machine is blocking
- Verify the droplet is running in DigitalOcean dashboard
- Check DigitalOcean firewall rules allow SSH (port 22)
- Try from a different network

### Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget build-essential
```

### Create a Non-Root User (Optional but Recommended)

```bash
# Create new user (replace 'deploy' with your preferred username)
adduser deploy

# Add user to sudo group
usermod -aG sudo deploy

# Switch to new user
su - deploy

# From now on, you can use 'sudo' before commands that need root access
```

---

## Step 3: Install Node.js

Veda Scholars requires Node.js v20 or higher. We'll install Node.js 21.x:

```bash
# Check current Node.js version (if any)
node --version
npm --version

# If you see Node.js v12, v14, v16, or v17, you need to remove it first
# Remove old Node.js versions (if installed via apt)
sudo apt remove -y nodejs npm nodejs-doc 2>/dev/null
sudo apt autoremove -y

# Remove old Node.js from common locations (if installed via nvm or other methods)
# Only run these if you're sure you want to remove old installations
# sudo rm -rf /usr/local/bin/node /usr/local/bin/npm
# sudo rm -rf /usr/bin/node /usr/bin/npm

# Add NodeSource repository for Node.js 21.x
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation (IMPORTANT - verify it's the correct version)
node --version
npm --version

# Should show:
# node v21.x.x (NOT v12, v14, v16, or v17)
# npm 10.x.x

# If you still see an old version, check which node is being used:
which node
# Should show: /usr/bin/node

# Check the actual version at that location:
/usr/bin/node --version
```

**Important:** If `node --version` still shows an old version (v12, v14, v16, or v17) after installation, see the troubleshooting section below.

### Alternative: Install Specific Node.js Version

If you need a specific version:

```bash
# Remove old Node.js first (see above)
sudo apt remove -y nodejs npm nodejs-doc 2>/dev/null
sudo apt autoremove -y

# Install Node.js 20.x instead
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
# Should show: v20.x.x
```

---

## Step 4: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify installation
git --version

# Configure Git (optional, but recommended)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 5: Install Nginx

Nginx will act as a reverse proxy for your applications:

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx

# Should show "active (running)"
```

### Verify Nginx is Working

```bash
# Test locally
curl http://localhost

# Or visit http://YOUR_SERVER_IP in your browser
# You should see the default Nginx welcome page
```

---

## Step 6: Install PM2

PM2 is a process manager for Node.js applications:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version

# Should show PM2 version number
```

---

## Step 7: Setup SSH Keys for Git

### Generate SSH Key (if you don't have one)

```bash
# Check if you already have an SSH key
ls -la ~/.ssh/id_ed25519.pub ~/.ssh/id_rsa.pub 2>/dev/null

# If either file exists, you can skip key generation and go to "Add SSH Key to GitHub"
# If neither exists, generate a new SSH key:

# Generate SSH key (replace with your GitHub email)
ssh-keygen -t ed25519 -C "sayedjamil16@gmail.com"

# Press Enter to accept default file location (~/.ssh/id_ed25519)
# Optionally set a passphrase for extra security (recommended)
# Or press Enter twice for no passphrase

# If your system doesn't support ed25519, use RSA:
ssh-keygen -t rsa -b 4096 -C "your.email@example.com"
```

### Add SSH Key to SSH Agent

```bash
# Start the ssh-agent
eval "$(ssh-agent -s)"

# Add your SSH private key to the ssh-agent
ssh-add ~/.ssh/id_ed25519

# Or if you used RSA:
# ssh-add ~/.ssh/id_rsa

# Verify the key was added
ssh-add -l
```

### Add SSH Key to GitHub

```bash
# Display your public key
cat ~/.ssh/id_ed25519.pub

# Or if you used RSA:
# cat ~/.ssh/id_rsa.pub

# Copy the entire output (it starts with ssh-ed25519 or ssh-rsa)
```

**Add to GitHub:**

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. In the sidebar, click **SSH and GPG keys**
4. Click **New SSH key** or **Add SSH key**
5. In the "Title" field, add a descriptive label (e.g., "Production Server")
6. Paste your public key into the "Key" field
7. Click **Add SSH key**

### Test SSH Connection to GitHub

```bash
# Test SSH connection
ssh -T git@github.com

# You should see a message like:
# Hi SayedJamil! You've successfully authenticated, but GitHub does not provide shell access.

# If you see "Permission denied", check:
# 1. Your SSH key was added correctly to GitHub
# 2. The key is added to ssh-agent (run ssh-add -l)
# 3. You're using the correct GitHub username
```

---

## Step 8: Clone Repository

### Option A: Clone to Home Directory

```bash
# Navigate to home directory
cd ~

# Clone repository using SSH
git clone git@github.com:SayedJamil/veda-scholars.git

# Navigate into project
cd veda-scholars
```

### Option B: Clone to Specific Directory

```bash
# Create project directory
mkdir -p /var/www
cd /var/www

# Clone repository using SSH
sudo git clone git@github.com:SayedJamil/veda-scholars.git

# Set ownership (if using non-root user)
sudo chown -R $USER:$USER veda-scholars

# Navigate into project
cd veda-scholars
```

**Note:** Using SSH keys is the recommended and secure method for Git authentication. Once set up, you won't need to enter credentials for git push/pull operations.

---

## Step 9: Install Project Dependencies

```bash
# Make sure you're in the project root directory
cd ~/veda-scholars
# OR
cd /var/www/veda-scholars

# IMPORTANT: Verify Node.js version before installing dependencies
node --version
# Must show v20.x.x or v21.x.x (NOT v12, v14, v16, or v17)

# If you see an old version, go back to Step 3 and fix Node.js installation

# Install all dependencies (root, backend, and frontend)
npm run install:all

# This may take a few minutes. It runs:
# - npm install (root)
# - npm install (backend)
# - npm install --legacy-peer-deps (frontend)
```

**If you encounter errors:**

```bash
# Clean install (remove node_modules and reinstall)
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all

# Or install manually:
npm install
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
```

---

## Step 10: Setup Environment Variables

### Backend Environment Variables

```bash
# Create backend .env file
nano backend/.env
```

Add the following content (update with your actual values):

```env
PORT=8483
NODE_ENV=production

# MongoDB Connection (choose one option)

# Option 1: MongoDB Atlas (Recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/veda-scholars?retryWrites=true&w=majority

# Option 2: Local MongoDB (if installed on server)
# MONGODB_URI=mongodb://localhost:27017/veda-scholars

# JWT Secret (generate a random secret)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this-to-random-string

# Email Configuration (choose one option based on your email provider)

# Option 1: Namecheap Private Email
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>

# Option 2: Google Workspace
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=info@vedascholars.com
# SMTP_PASS=your-app-password
# SMTP_FROM="Veda Scholars" <info@vedascholars.com>

# Contact Emails
CONTACT_EMAIL=enquiries@vedascholars.com
PARTNERS_EMAIL=partners@vedascholars.com
```

**Generate a secure JWT secret:**

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and use it as JWT_SECRET
```

Save and exit (Ctrl+X, then Y, then Enter).

### Frontend Environment Variables

```bash
# Create frontend .env.local file
nano frontend/.env.local
```

Add the following content:

```env
# For IP address (replace with your server IP)
NEXT_PUBLIC_GRAPHQL_URL=http://YOUR_SERVER_IP/graphql

# OR for domain name (if you have one configured)
# NEXT_PUBLIC_GRAPHQL_URL=https://vedascholars.com/graphql
```

Save and exit (Ctrl+X, then Y, then Enter).

**Note:** After setting up SSL (Step 15), update this to use HTTPS.

---

## Step 11: Build Applications

```bash
# Make sure you're in project root
cd ~/veda-scholars
# OR
cd /var/www/veda-scholars

# Build backend
cd backend
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..

# Verify builds succeeded
# Backend should have a 'dist' directory
ls -la backend/dist/

# Frontend should have a '.next' directory
ls -la frontend/.next/
```

**If build fails:**

```bash
# Clean and rebuild
cd backend
rm -rf dist node_modules
npm install
npm run build
cd ..

cd frontend
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
cd ..
```

---

## Step 12: Setup PM2

### Create Logs Directory

```bash
# Create logs directory in project root
mkdir -p ~/veda-scholars/logs
# OR
mkdir -p /var/www/veda-scholars/logs
```

### Start Applications with PM2

```bash
# Navigate to project root
cd ~/veda-scholars
# OR
cd /var/www/veda-scholars

# Start applications using ecosystem.config.js
pm2 start ecosystem.config.js

# Check status
pm2 status

# Should show both 'veda-backend' and 'veda-frontend' as 'online'

# View logs
pm2 logs

# View specific service logs
pm2 logs veda-backend
pm2 logs veda-frontend
```

### Save PM2 Configuration

```bash
# Save current PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# This will output a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
#
# Copy and run the command that PM2 outputs
# Replace 'deploy' with your username if different
```

**Example:**

```bash
# If PM2 outputs:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root

# Run it:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### Verify Services are Running

```bash
# Check PM2 status
pm2 status

# Check if ports are listening
sudo netstat -tulpn | grep -E "3000|8483"

# Should show:
# tcp  0  0  127.0.0.1:3000  LISTEN  (frontend)
# tcp  0  0  127.0.0.1:8483  LISTEN  (backend)

# Test backend locally
curl http://localhost:8483/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Should return: {"data":{"__typename":"Query"}}

# Test frontend locally
curl http://localhost:3000

# Should return HTML content
```

---

## Step 13: Configure Nginx

### Option A: Using Domain Name (vedascholars.com)

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/veda-scholars
```

Add the following configuration:

```nginx
# Rate limiting to prevent abuse
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;

# Custom log format for detailed access logging
log_format veda_scholars '$remote_addr - $remote_user [$time_local] '
                         '"$request" $status $body_bytes_sent '
                         '"$http_referer" "$http_user_agent" '
                         '"$http_x_forwarded_for" '
                         'rt=$request_time uct="$upstream_connect_time" '
                         'uht="$upstream_header_time" urt="$upstream_response_time"';

server {
    listen 80;
    server_name vedascholars.com www.vedascholars.com;

    # Access and error logging
    access_log /var/log/nginx/veda-scholars-access.log veda_scholars;
    error_log /var/log/nginx/veda-scholars-error.log warn;

    # Client body size limit
    client_max_body_size 10M;

    # Timeouts to prevent hanging connections
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Frontend (Next.js)
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

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Option B: Using IP Address

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/veda-scholars
```

Add the following configuration (replace `YOUR_SERVER_IP` with your actual IP):

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;

# Custom log format
log_format veda_scholars '$remote_addr - $remote_user [$time_local] '
                         '"$request" $status $body_bytes_sent '
                         '"$http_referer" "$http_user_agent" '
                         '"$http_x_forwarded_for" '
                         'rt=$request_time uct="$upstream_connect_time" '
                         'uht="$upstream_header_time" urt="$upstream_response_time"';

server {
    listen 80;
    server_name YOUR_SERVER_IP;  # Replace with your actual IP, e.g., 139.59.9.114

    # Access and error logging
    access_log /var/log/nginx/veda-scholars-access.log veda_scholars;
    error_log /var/log/nginx/veda-scholars-error.log warn;

    client_max_body_size 10M;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Frontend
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
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### Enable and Test Nginx Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/veda-scholars /etc/nginx/sites-enabled/

# Remove default nginx site (if it exists and conflicts)
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration (VERY IMPORTANT)
sudo nginx -t

# Should say:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# If test passes, reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx

# Should show "active (running)"
```

### Verify Nginx is Working

```bash
# Test from server
curl http://localhost

# Should return HTML from your frontend

# Test from your local machine (replace with your domain or IP)
curl http://vedascholars.com
# OR
curl http://YOUR_SERVER_IP

# Should return HTML content
```

---

## Step 14: Configure Firewall

Configure UFW (Uncomplicated Firewall) to allow necessary traffic:

```bash
# Allow SSH (important - do this first!)
sudo ufw allow OpenSSH

# Allow HTTP (port 80)
sudo ufw allow 'Nginx HTTP'

# Allow HTTPS (port 443) - for SSL
sudo ufw allow 'Nginx HTTPS'

# OR allow both HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw --force enable

# Check firewall status
sudo ufw status

# Should show:
# Status: active
# To                         Action      From
# --                         ------      ----
# OpenSSH                    ALLOW       Anywhere
# Nginx Full                 ALLOW       Anywhere
# OpenSSH (v6)               ALLOW       Anywhere (v6)
# Nginx Full (v6)            ALLOW       Anywhere (v6)
```

**Important:** Make sure SSH is allowed before enabling the firewall, otherwise you might lock yourself out!

---

## Step 15: Setup SSL (Optional)

SSL is recommended for production. This requires a domain name.

### Prerequisites

- Domain name pointing to your server (DNS A record configured)
- Nginx configured and running
- Port 80 and 443 open in firewall

### Install Certbot

```bash
# Update package list
sudo apt update

# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

### Obtain SSL Certificate

**Option 1: With www subdomain (Recommended)**

```bash
# First, ensure DNS A records exist for both:
# - vedascholars.com → YOUR_SERVER_IP
# - www.vedascholars.com → YOUR_SERVER_IP

# Check DNS records
nslookup vedascholars.com
nslookup www.vedascholars.com
# Both should return your server IP

# If www.vedascholars.com doesn't resolve, add DNS A record in your DNS provider:
# - Host: www
# - Type: A
# - Value: YOUR_SERVER_IP
# - TTL: Automatic or 3600

# Wait 5-30 minutes for DNS propagation, then:
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com

# Certbot will:
# 1. Ask for your email (for renewal notifications)
# 2. Ask to agree to terms of service
# 3. Ask if you want to share email with EFF (optional)
# 4. Automatically configure Nginx with SSL
# 5. Set up automatic renewal
```

**Option 2: Without www subdomain**

```bash
# Get SSL only for main domain
sudo certbot --nginx -d vedascholars.com
```

### Update Frontend Environment for HTTPS

After SSL is installed, update frontend to use HTTPS:

```bash
# Edit frontend environment
nano frontend/.env.local
```

Update to:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://vedascholars.com/graphql
```

Rebuild and restart frontend:

```bash
cd frontend
npm run build
cd ..
pm2 restart veda-frontend
```

### Verify SSL Installation

```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t

# Check if HTTPS is working
curl -I https://vedascholars.com

# Should show HTTP/2 200 or similar
```

### Automatic Certificate Renewal

Certbot automatically sets up renewal. Test it:

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check renewal status
sudo systemctl status certbot.timer
```

---

## Step 16: Verify Everything is Working

### Check All Services

```bash
# Check PM2 status
pm2 status
# Both services should show "online"

# Check Nginx status
sudo systemctl status nginx
# Should show "active (running)"

# Check ports
sudo netstat -tulpn | grep -E "3000|8483|80|443"
# Should show all ports listening
```

### Test Backend

```bash
# Test GraphQL endpoint locally
curl http://localhost:8483/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'

# Should return: {"data":{"__typename":"Query"}}

# Test from outside (replace with your domain/IP)
curl https://vedascholars.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

### Test Frontend

```bash
# Test locally
curl http://localhost:3000

# Test from outside
curl https://vedascholars.com
# OR
curl http://YOUR_SERVER_IP
```

### Check Logs

```bash
# PM2 logs
pm2 logs --lines 50

# Nginx logs
sudo tail -50 /var/log/nginx/veda-scholars-access.log
sudo tail -50 /var/log/nginx/veda-scholars-error.log

# Real-time log monitoring
pm2 logs
sudo tail -f /var/log/nginx/veda-scholars-access.log
```

### Test in Browser

1. Visit your website:

   - `https://vedascholars.com` (if SSL configured)
   - OR `http://YOUR_SERVER_IP`

2. Verify:
   - Website loads correctly
   - No console errors
   - Navigation works
   - API calls work (check browser network tab)

---

## Troubleshooting

### SSH Connection Timeout

```bash
# Check if droplet is running in DigitalOcean dashboard
# Verify firewall allows SSH (port 22)
# Try from different network
# Check if IP address is correct
```

### Node.js Installation Failed or Wrong Version

If Node.js installation fails or you see an old version (v12, v14, v16, v17) after installation:

```bash
# Check current version
node --version

# If it shows v12, v14, v16, or v17, remove it completely:
sudo apt remove -y nodejs npm nodejs-doc
sudo apt autoremove -y

# Clear apt cache
sudo apt clean
sudo apt update

# Check if nodejs package is still installed
dpkg -l | grep nodejs

# If any nodejs packages are listed, remove them:
sudo apt purge -y nodejs npm nodejs-doc

# Remove NodeSource repository (if it was added incorrectly)
sudo rm -f /etc/apt/sources.list.d/nodesource.list
sudo rm -f /etc/apt/sources.list.d/nodesource.list.save
sudo apt update

# Now install Node.js 21.x properly
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Should show Node.js v21.x.x or v20.x.x (NOT v12, v14, v16, or v17)
```

### Old Node.js Version Error (EBADENGINE / Unsupported engine)

If you see errors like:

```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'bcrypt@6.0.0',
npm WARN EBADENGINE   required: { node: '>= 18' },
npm WARN EBADENGINE   current: { node: 'v12.22.9', npm: '8.5.1' }
npm WARN EBADENGINE }
```

This means you're using an old Node.js version. Follow these steps:

```bash
# 1. Check current Node.js version
node --version

# If it shows v12, v14, v16, or v17, you need to upgrade

# 2. Remove old Node.js completely
sudo apt remove -y nodejs npm nodejs-doc
sudo apt autoremove -y
sudo apt purge -y nodejs npm

# 3. Clear any existing NodeSource repositories
sudo rm -f /etc/apt/sources.list.d/nodesource.list*
sudo apt update

# 4. Install Node.js 21.x (or 20.x)
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Verify the new version is active
node --version
# Must show v20.x.x or v21.x.x

# 6. If it still shows an old version, check which node binary is being used:
which node
/usr/bin/node --version

# 7. If /usr/bin/node shows the correct version but 'node --version' doesn't,
#    check your PATH:
echo $PATH
# Make sure /usr/bin is in PATH

# 8. Reload your shell or start a new session
exec $SHELL
# OR
exit
# Then SSH back into the server

# 9. Verify again
node --version
npm --version

# 10. Now try installing dependencies again
npm run install:all
```

### PM2 Services Not Starting

```bash
# Check logs
pm2 logs

# Delete and recreate processes
pm2 delete all
cd ~/veda-scholars  # or your project path
pm2 start ecosystem.config.js
pm2 save
```

### Nginx Configuration Errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/nginx/veda-scholars-error.log

# Common issues:
# - Syntax errors in config file
# - Missing semicolons
# - Incorrect paths
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8483
sudo lsof -i :80

# Kill process (replace PID with actual process ID)
sudo kill -9 <PID>
```

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules backend/node_modules frontend/node_modules
rm -rf backend/dist frontend/.next
npm run install:all
npm run build
```

### SSL Certificate Issues

```bash
# Verify DNS is pointing to server
nslookup vedascholars.com

# Check if port 80 is accessible
curl http://vedascholars.com

# Retry certbot
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com

# Check certificate status
sudo certbot certificates
```

### Memory Issues

If you're on a small server (1GB RAM), you might need to adjust PM2 memory limits:

```bash
# Edit ecosystem.config.js
nano ecosystem.config.js

# Reduce max_memory_restart values:
# backend: "500M" instead of "800M"
# frontend: "800M" instead of "1200M"

# Restart PM2
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

## Post-Setup Checklist

- [ ] Droplet created and accessible via SSH
- [ ] System packages updated
- [ ] Node.js installed (v20+)
- [ ] Git installed
- [ ] Nginx installed and running
- [ ] PM2 installed globally
- [ ] Repository cloned
- [ ] Dependencies installed (`npm run install:all`)
- [ ] Backend `.env` file created and configured
- [ ] Frontend `.env.local` file created and configured
- [ ] Applications built successfully
- [ ] PM2 processes running (both veda-backend and veda-frontend online)
- [ ] PM2 startup configured
- [ ] Nginx configured and tested
- [ ] Firewall configured (SSH, HTTP, HTTPS)
- [ ] SSL certificate installed (if using domain)
- [ ] Website accessible in browser
- [ ] Backend API responding
- [ ] Frontend loading correctly
- [ ] Logs checked and no errors

---

## Useful Commands Reference

```bash
# PM2 Commands
pm2 status                    # Check status
pm2 logs                      # View all logs
pm2 logs veda-backend         # View backend logs
pm2 logs veda-frontend        # View frontend logs
pm2 restart all               # Restart all services
pm2 restart veda-backend      # Restart backend
pm2 restart veda-frontend     # Restart frontend
pm2 stop all                  # Stop all services
pm2 delete all                # Delete all processes

# Nginx Commands
sudo nginx -t                 # Test configuration
sudo systemctl reload nginx   # Reload Nginx
sudo systemctl restart nginx  # Restart Nginx
sudo systemctl status nginx   # Check status
sudo tail -f /var/log/nginx/veda-scholars-access.log   # Monitor access logs
sudo tail -f /var/log/nginx/veda-scholars-error.log    # Monitor error logs

# System Commands
sudo apt update && sudo apt upgrade -y    # Update system
sudo systemctl status <service>           # Check service status
sudo netstat -tulpn | grep <port>         # Check if port is in use
df -h                                      # Check disk space
free -h                                    # Check memory usage
top                                        # Monitor system resources
```

---

## Next Steps

After completing the setup:

1. **Regular Updates**: Keep your system and dependencies updated
2. **Monitoring**: Set up monitoring for your applications (PM2 has built-in monitoring)
3. **Backups**: Set up regular backups of your database and code
4. **Domain**: If using IP, consider getting a domain name for easier access
5. **SSL**: Always use SSL (HTTPS) for production
6. **Security**: Regularly update system packages and Node.js
7. **Logs**: Monitor logs regularly for errors

---

**Your Veda Scholars server should now be fully set up and running!** 🎉
