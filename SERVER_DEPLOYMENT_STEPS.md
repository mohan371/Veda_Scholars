# Server Deployment Steps - Pull and Deploy Code

This guide shows you how to pull the latest code from GitHub and deploy it on your server.

## Prerequisites

- SSH access to your server
- Git installed on server
- Node.js and npm installed
- PM2 installed globally (`sudo npm install -g pm2`)
- Nginx installed (`sudo apt install nginx`)
- Domain name configured (optional - can use IP address)

## Step 1: SSH into Your Server

```bash
ssh root@YOUR_SERVER_IP
# OR
ssh deploy@YOUR_SERVER_IP
```

## Step 2: Navigate to Project Directory

```bash
cd /home/deploy/veda-scholars
# OR if using home directory:
cd ~/veda-scholars
```

## Step 3: Pull Latest Code from GitHub

### Option A: Pull from Main Branch (Production)

```bash
# Make sure you're on main branch
git checkout main

# Pull latest changes
git pull origin main
```

### Option B: Pull from Specific Branch (e.g., feature/authentication)

```bash
# Fetch all branches
git fetch origin

# Checkout the branch (creates local branch if it doesn't exist)
git checkout feature/authentication

# Pull latest changes
git pull origin feature/authentication
```

**If you get conflicts:**

```bash
# If you have local changes you want to discard:
git reset --hard origin/main  # or origin/feature/authentication
git pull origin main  # or feature/authentication
```

## Step 4: Install/Update Dependencies

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all
npm audit fix --force

# OR manually:
npm install
cd backend && npm install && cd ..
cd frontend && npm install --legacy-peer-deps && cd ..
```

## Step 5: Update Environment Variables

### Backend Environment Variables

```bash
nano backend/.env
```

Update with production values:

**For MongoDB:**

```env
# Option 1: MongoDB Atlas (Cloud - Recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/veda-scholars?retryWrites=true&w=majority

# Option 2: Local MongoDB (if installed on same server)
MONGODB_URI=mongodb://localhost:27017/veda-scholars

# Option 3: MongoDB with authentication (local)
MONGODB_URI=mongodb://username:password@localhost:27017/veda-scholars?authSource=admin
```

**For Custom Domain Email (vedascholars.com):**

The SMTP settings depend on your email hosting provider:

**Option 1: Namecheap Private Email (if domain is on Namecheap)**

```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
```

**Option 2: Google Workspace (G Suite)**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-app-password  # Generate App Password in Google Admin
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
```

**Option 3: Microsoft 365 / Outlook**

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
```

**Option 4: Zoho Mail**

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
```

**Option 5: Custom SMTP Server (from your hosting provider)**

```env
SMTP_HOST=mail.vedascholars.com  # Or smtp.vedascholars.com
SMTP_PORT=587  # Or 465 for SSL
SMTP_SECURE=false  # true for port 465, false for port 587
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
```

**Complete Example (using Namecheap Private Email):**

```env
PORT=8483
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veda-scholars?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@vedascholars.com
SMTP_PASS=your-email-password
SMTP_FROM="Veda Scholars" <info@vedascholars.com>
CONTACT_EMAIL=enquiries@vedascholars.com
PARTNERS_EMAIL=partners@vedascholars.com
```

### Frontend Environment Variables

```bash
nano frontend/.env.local
```

Update with production values:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://vedascholars.com/graphql
```

## Step 6: Build the Applications

### Build Backend

```bash
cd backend
npm run build
cd ..
```

### Build Frontend

```bash
cd frontend
npm run build
cd ..
```

## Step 7: Start/Restart Services with PM2

### If PM2 processes don't exist (fresh start):

**Option 1: Using ecosystem.config.js (Recommended)**

```bash
# Make sure you're in the project root
cd ~/veda-scholars

# Create logs directory (if it doesn't exist)
mkdir -p logs

# Start services using ecosystem.config.js
pm2 start ecosystem.config.js

# Save PM2 configuration (so it persists after reboot)
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Run the command that PM2 outputs (usually something like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy)

# Check status
pm2 status
# Should show both veda-backend and veda-frontend as "online"
```

**Option 2: Manual Start (Without ecosystem.config.js)**

```bash
# Make sure you're in the project root
cd ~/veda-scholars

# Create logs directory
mkdir -p logs

# Start Backend
pm2 start npm --name "veda-backend" \
  --cwd "./backend" \
  -- start \
  --env NODE_ENV=production \
  --env PORT=8483 \
  --env NODE_OPTIONS="--max-old-space-size=768" \
  --max-memory-restart 800M \
  --error ./logs/backend-error.log \
  --output ./logs/backend-out.log \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --autorestart \
  --no-watch \
  --instances 1 \
  --exec-mode fork \
  --min-uptime 10s \
  --max-restarts 10 \
  --kill-timeout 5000

# Start Frontend
pm2 start npm --name "veda-frontend" \
  --cwd "./frontend" \
  -- start \
  --env NODE_ENV=production \
  --env PORT=3000 \
  --env NODE_OPTIONS="--max-old-space-size=1024" \
  --max-memory-restart 1.2G \
  --error ./logs/frontend-error.log \
  --output ./logs/frontend-out.log \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs \
  --autorestart \
  --no-watch \
  --instances 1 \
  --exec-mode fork \
  --min-uptime 10s \
  --max-restarts 10 \
  --kill-timeout 5000

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Run the command that PM2 outputs

# Check status
pm2 status
# Should show both veda-backend and veda-frontend as "online"
```

**Option 3: Simple Manual Start (Minimal Configuration)**

If you just want to start the services quickly without all the options:

```bash
# Navigate to project root
cd ~/veda-scholars

# Start Backend
cd backend
pm2 start npm --name "veda-backend" -- start
cd ..

# Start Frontend
cd frontend
pm2 start npm --name "veda-frontend" -- start
cd ..

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

**Note:** Option 3 is simpler but doesn't include memory limits, log configuration, or other optimizations. Use Option 1 or 2 for production.

### If PM2 processes already exist (just restarting):

```bash
# Restart all services
pm2 restart all

# OR restart individually:
pm2 restart veda-backend
pm2 restart veda-frontend

# Check status
pm2 status

# View logs
pm2 logs
```

### Verify Services are Running:

```bash
# Check PM2 status
pm2 status
# Both services should show "online" status

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

## Step 8: Configure Nginx (Link Domain/IP to Services)

### Option A: Using Domain Name (vedascholars.com)

```bash
# Create or edit Nginx configuration
sudo nano /etc/nginx/sites-available/veda-scholars
```

Add this configuration:

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

### Option B: Using IP Address (for testing or if no domain)

```bash
# Create or edit Nginx configuration
sudo nano /etc/nginx/sites-available/veda-scholars
```

Add this configuration (replace `YOUR_SERVER_IP` with your actual IP):

```nginx
# Rate limiting
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
}
```

### Enable and Start Nginx:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/veda-scholars /etc/nginx/sites-enabled/

# Remove default nginx site (if it exists and conflicts)
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration (VERY IMPORTANT - catches errors)
sudo nginx -t
# Should say: "syntax is ok" and "test is successful"

# If test passes, start/reload Nginx
sudo systemctl start nginx
# OR if nginx is already running:
sudo systemctl reload nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
# Should show "active (running)"

# Check Nginx is listening on port 80
sudo netstat -tulpn | grep :80
# Should show nginx listening
```

### Verify Nginx is Working:

```bash
# Test from server
curl http://localhost
# Should return HTML from your frontend

# Test from your local machine (replace with your domain or IP)
curl http://vedascholars.com
# OR
curl http://YOUR_SERVER_IP

# Check Nginx error logs if something doesn't work
sudo tail -50 /var/log/nginx/error.log

# Check Veda Scholars specific logs
sudo tail -50 /var/log/nginx/veda-scholars-error.log
sudo tail -50 /var/log/nginx/veda-scholars-access.log

# Monitor access logs in real-time
sudo tail -f /var/log/nginx/veda-scholars-access.log

# Monitor error logs in real-time
sudo tail -f /var/log/nginx/veda-scholars-error.log

# View last 100 access log entries with IP addresses
sudo tail -100 /var/log/nginx/veda-scholars-access.log | awk '{print $1, $4, $5, $7, $9}'

# Count requests by status code
sudo awk '{print $9}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn

# Find most requested pages
sudo awk '{print $7}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn | head -20

# Find top IP addresses
sudo awk '{print $1}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn | head -20
```

## Step 9: Install SSL Certificate (HTTPS)

### Prerequisites for SSL:

- Domain name pointing to your server (A record configured in DNS)
- Nginx configured and running (Step 8 completed)
- Port 80 and 443 open in firewall

### Install Certbot (Let's Encrypt):

```bash
# Update package list
sudo apt update

# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify installation
certbot --version
```

### Obtain SSL Certificate:

**Option 1: With www subdomain (Recommended)**

```bash
# First, ensure DNS A records exist for both:
# - vedascholars.com → YOUR_SERVER_IP
# - www.vedascholars.com → YOUR_SERVER_IP

# Check DNS records (from your local machine or server):
nslookup vedascholars.com
nslookup www.vedascholars.com
# Both should return your server IP

# If www.vedascholars.com doesn't resolve, add DNS A record:
# In your DNS provider (Namecheap, Cloudflare, etc.):
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

**Option 2: Without www subdomain (If www DNS not configured)**

If you don't have a DNS record for `www.vedascholars.com`, get SSL only for the main domain:

```bash
# Request SSL certificate for main domain only
sudo certbot --nginx -d vedascholars.com

# This will get SSL for vedascholars.com only
# Users can access via https://vedascholars.com
```

**Option 3: Add www DNS record later**

You can get SSL for the main domain now and add www later:

```bash
# Step 1: Get SSL for main domain
sudo certbot --nginx -d vedascholars.com

# Step 2: Add www DNS A record in your DNS provider
# Step 3: Wait for DNS propagation (5-30 minutes)
# Step 4: Expand certificate to include www
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com --expand
```

**For IP Address (Not Recommended):**

SSL certificates require a domain name. If you only have an IP address, you cannot get a free SSL certificate from Let's Encrypt. You would need:

- A domain name (even a free one like from Freenom)
- Or a self-signed certificate (browsers will show warnings)

### Verify SSL Installation:

```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
sudo nginx -t

# Check if HTTPS is working
curl -I https://vedascholars.com
# Should show HTTP/2 200 or similar

# Test from browser
# Visit: https://vedascholars.com
# Should show a padlock icon (secure connection)
```

### Automatic Certificate Renewal:

Certbot automatically sets up renewal, but you can test it:

```bash
# Test renewal (dry run - doesn't actually renew)
sudo certbot renew --dry-run

# Check renewal status
sudo systemctl status certbot.timer
# Should show "active (waiting)"

# View renewal logs
sudo journalctl -u certbot.timer
```

Certificates auto-renew 30 days before expiration. You can also manually renew:

```bash
# Manual renewal
sudo certbot renew

# Reload Nginx after renewal
sudo systemctl reload nginx
```

### Update Frontend Environment Variables for HTTPS:

After SSL is installed, update your frontend to use HTTPS:

```bash
# Edit frontend environment
nano frontend/.env.local
```

Update the GraphQL URL:

```env
# Change from HTTP to HTTPS
NEXT_PUBLIC_GRAPHQL_URL=https://vedascholars.com/graphql
```

Rebuild frontend:

```bash
cd frontend
npm run build
cd ..
pm2 restart veda-frontend
```

### Troubleshooting SSL Installation:

**Issue: "Could not bind TCP port 80"**

```bash
# Nginx is already using port 80, which is correct
# Use --nginx flag instead of --standalone
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com
```

**Issue: "Invalid response from https://vedascholars.com/.well-known/acme-challenge/"**

```bash
# 1. Verify DNS is pointing to your server
nslookup vedascholars.com
# Should show your server IP

# 2. Verify Nginx is accessible
curl http://vedascholars.com
# Should return HTML

# 3. Check Nginx config has proper location block
sudo nano /etc/nginx/sites-available/veda-scholars
# Make sure there's no conflicting location blocks

# 4. Retry Certbot
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com
```

**Issue: "Domain not pointing to this server" or "NXDOMAIN looking up A"**

```bash
# Check DNS A record for main domain
dig vedascholars.com +short
# OR
nslookup vedascholars.com
# Should return your server IP

# Check DNS A record for www subdomain
dig www.vedascholars.com +short
# OR
nslookup www.vedascholars.com
# Should return your server IP

# If www.vedascholars.com shows "NXDOMAIN" or no result:
# 1. Add DNS A record in your DNS provider:
#    - Host: www
#    - Type: A
#    - Value: YOUR_SERVER_IP
#    - TTL: Automatic or 3600
#
# 2. Wait for DNS propagation (5-30 minutes, can take up to 48 hours)
#
# 3. Verify DNS is working:
dig www.vedascholars.com +short
# Should now return your server IP
#
# 4. Retry Certbot:
sudo certbot --nginx -d vedascholars.com -d www.vedascholars.com

# OR get SSL for main domain only (without www):
sudo certbot --nginx -d vedascholars.com
```

**Issue: Certificate installed but site shows "Not Secure"**

```bash
# Check Nginx config was updated correctly
sudo nginx -t
sudo cat /etc/nginx/sites-available/veda-scholars
# Should show SSL configuration

# Restart Nginx
sudo systemctl restart nginx

# Clear browser cache and try again
```

### Force HTTPS Redirect (Optional but Recommended):

Certbot usually adds this automatically, but you can verify:

```bash
sudo nano /etc/nginx/sites-available/veda-scholars
```

You should see something like:

```nginx
server {
    listen 80;
    server_name vedascholars.com www.vedascholars.com;
    return 301 https://$server_name$request_uri;  # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name vedascholars.com www.vedascholars.com;

    ssl_certificate /etc/letsencrypt/live/vedascholars.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vedascholars.com/privkey.pem;

    # ... rest of configuration
}
```

### SSL Configuration Best Practices:

Certbot configures good defaults, but you can enhance security:

```bash
# Check current SSL configuration
sudo nginx -T | grep ssl

# Certbot automatically adds:
# - Modern SSL protocols (TLS 1.2, TLS 1.3)
# - Strong cipher suites
# - HSTS headers (if you choose)
```

## Step 10: Verify Deployment

### Check Services are Running

```bash
pm2 status
# Should show both veda-backend and veda-frontend as "online"
```

### Test Backend

```bash
curl http://localhost:8483/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

### Test Frontend

```bash
curl http://localhost:3000
```

### Check Logs for Errors

```bash
# Backend logs
pm2 logs veda-backend --lines 50

# Frontend logs
pm2 logs veda-frontend --lines 50
```

## Step 11: Verify Website is Live

### Test from Browser:

1. **If using domain name with SSL:**

   - Visit `https://vedascholars.com` in your browser
   - Check that the website loads correctly
   - Verify padlock icon shows (secure connection)
   - HTTP should automatically redirect to HTTPS

2. **If using domain name without SSL:**

   - Visit `http://vedascholars.com` in your browser
   - Check that the website loads correctly

3. **If using IP address:**
   - Visit `http://YOUR_SERVER_IP` in your browser
   - Check that the website loads correctly
   - Note: SSL requires a domain name

### Test Functionality:

1. **Frontend:**

   - Website should load without errors
   - Navigation should work
   - Pages should be accessible

2. **Backend API:**

   - Test GraphQL endpoint: `https://vedascholars.com/graphql` (or `http://YOUR_SERVER_IP/graphql` if no SSL)
   - You can test with a simple query using curl or a GraphQL client
   - Example curl test:

   ```bash
   curl https://vedascholars.com/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ __typename }"}'
   ```

3. **Contact Form:**
   - Test contact form submission
   - Verify emails are being sent

### Check Logs if Issues:

```bash
# PM2 logs
pm2 logs --lines 50

# Nginx logs (general)
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/nginx/access.log

# Veda Scholars specific logs
sudo tail -50 /var/log/nginx/veda-scholars-error.log
sudo tail -50 /var/log/nginx/veda-scholars-access.log

# Real-time log monitoring
sudo tail -f /var/log/nginx/veda-scholars-access.log
sudo tail -f /var/log/nginx/veda-scholars-error.log

# Analyze access logs
# Count requests by status code
sudo awk '{print $9}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn

# Find most requested pages
sudo awk '{print $7}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn | head -20

# Find top IP addresses
sudo awk '{print $1}' /var/log/nginx/veda-scholars-access.log | sort | uniq -c | sort -rn | head -20

# Find slow requests (request time > 1 second)
sudo awk '$NF > 1 {print $0}' /var/log/nginx/veda-scholars-access.log | tail -20

# System logs
sudo journalctl -u nginx -n 50
```

## Quick Deployment Script

You can create a script for quick deployments:

```bash
nano deploy.sh
```

Add this content:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/veda-scholars

# Pull latest code
echo "📥 Pulling latest code..."
git checkout main
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build applications
echo "🔨 Building applications..."
cd backend && npm run build && cd ..
cd frontend && npm run build && cd ..

# Restart services
echo "🔄 Restarting services..."
pm2 restart all

# Show status
echo "✅ Deployment complete!"
pm2 status
```

Make it executable:

```bash
chmod +x deploy.sh
```

Then run:

```bash
./deploy.sh
```

## Troubleshooting

### Issue: Git pull fails with authentication

**Solution:**

```bash
# Use SSH keys or Personal Access Token
# See GITHUB_AUTH_SETUP.md for details
```

### Issue: Build fails

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

### Issue: Services won't start

**Solution:**

```bash
# Check logs
pm2 logs

# Delete and recreate PM2 processes
pm2 delete all
pm2 start ecosystem.config.js
```

### Issue: Port already in use

**Solution:**

```bash
# Find process using port
lsof -i :8483
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Environment-Specific Deployment

### For Production (vedascholars.com)

```bash
# Use production environment variables
export NODE_ENV=production

# Ensure HTTPS URLs in frontend/.env.local
# NEXT_PUBLIC_GRAPHQL_URL=https://vedascholars.com/graphql
```

### For Staging/Testing

```bash
# Use staging environment variables
export NODE_ENV=development

# Use staging URLs
# NEXT_PUBLIC_GRAPHQL_URL=http://staging.vedascholars.com/graphql
```

## Automated Deployment (Optional)

Set up a GitHub webhook or use CI/CD for automatic deployments:

1. **GitHub Actions**: Create `.github/workflows/deploy.yml`
2. **Webhook**: Set up webhook to trigger deployment script
3. **Cron Job**: Schedule regular deployments

## Post-Deployment Checklist

- [ ] Code pulled from main branch
- [ ] Dependencies installed
- [ ] Environment variables updated
- [ ] Backend built successfully
- [ ] Frontend built successfully
- [ ] PM2 services restarted
- [ ] Website accessible at https://vedascholars.com (or http:// if no SSL)
- [ ] SSL certificate installed and valid (if using domain)
- [ ] HTTPS redirect working (HTTP → HTTPS)
- [ ] API endpoints working
- [ ] Contact form working
- [ ] No errors in logs

## Quick Reference: Common Scenarios

### Scenario 1: Fresh Server Setup (No PM2, No Nginx)

```bash
# 1. Install PM2 globally
sudo npm install -g pm2

# 2. Install Nginx
sudo apt update
sudo apt install nginx -y

# 3. Follow Steps 1-10 above
```

### Scenario 2: PM2 Processes Deleted (Need to Start Fresh)

```bash
# Navigate to project
cd ~/veda-scholars

# Create logs directory
mkdir -p logs

# Start PM2 services
pm2 start ecosystem.config.js

# Save and enable startup
pm2 save
pm2 startup
# Run the command PM2 outputs

# Verify
pm2 status
```

### Scenario 3: Nginx Not Configured (Need to Link Domain/IP)

```bash
# Follow Step 8 above (Configure Nginx)
# Choose Option A (Domain) or Option B (IP Address)
```

### Scenario 4: Using IP Address Instead of Domain

```bash
# 1. In Step 8, use Option B (IP Address configuration)
# 2. Replace YOUR_SERVER_IP with your actual server IP
# 3. Update frontend/.env.local:
#    NEXT_PUBLIC_GRAPHQL_URL=http://YOUR_SERVER_IP/graphql
# 4. Rebuild frontend:
cd frontend
npm run build
cd ..
pm2 restart veda-frontend
```

### Scenario 5: Check if Everything is Running

```bash
# Check PM2
pm2 status
pm2 logs --lines 20

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check ports
sudo netstat -tulpn | grep -E "3000|8483|80"

# Test locally
curl http://localhost:3000
curl http://localhost:8483/graphql -H "Content-Type: application/json" -d '{"query": "{ __typename }"}'

# Test from outside (replace with your domain/IP)
curl http://vedascholars.com
# OR
curl http://YOUR_SERVER_IP
```

---

**Your website should now be updated with the latest code!** 🎉
