#!/bin/bash

# Veda Scholars Deployment Script
# This script automates the deployment process on DigitalOcean

set -e  # Exit on any error

echo "🚀 Starting Veda Scholars Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Some commands may require sudo. You may be prompted for password.${NC}"
fi

# Step 1: Update system
echo -e "${GREEN}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo -e "${GREEN}📦 Installing Node.js 21.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"
    echo -e "${GREEN}✅ npm installed: $(npm --version)${NC}"
else
    echo -e "${GREEN}✅ Node.js already installed: $(node --version)${NC}"
    echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
fi

# Step 3: Install MongoDB if not installed
if ! command -v mongod &> /dev/null; then
    echo -e "${GREEN}📦 Installing MongoDB...${NC}"
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt update
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    echo -e "${GREEN}✅ MongoDB installed and started${NC}"
else
    echo -e "${GREEN}✅ MongoDB already installed${NC}"
fi

# Step 4: Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo -e "${GREEN}📦 Installing Nginx...${NC}"
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed and started${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
fi

# Step 5: Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}"
else
    echo -e "${GREEN}✅ PM2 already installed${NC}"
fi

# Step 6: Install Git if not installed
if ! command -v git &> /dev/null; then
    echo -e "${GREEN}📦 Installing Git...${NC}"
    sudo apt install -y git
    echo -e "${GREEN}✅ Git installed${NC}"
else
    echo -e "${GREEN}✅ Git already installed${NC}"
fi

# Step 7: Check if repository exists
# Check if we're already inside the repository
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Already inside repository directory${NC}"
    REPO_DIR="."
# Check if veda-scholars subdirectory exists
elif [ -d "veda-scholars" ]; then
    echo -e "${GREEN}✅ Repository found in subdirectory${NC}"
    REPO_DIR="veda-scholars"
else
    echo -e "${YELLOW}⚠️  Repository not found. Please clone it first:${NC}"
    echo "   git clone https://github.com/SayedJamil/veda-scholars.git"
    echo "   cd veda-scholars"
    exit 1
fi

cd "$REPO_DIR"

# Step 8: Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm run install:all

# Step 9: Check for environment files
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating template...${NC}"
    cat > backend/.env << EOF
PORT=8483
MONGODB_URI=mongodb://localhost:27017/veda-scholars
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ Created backend/.env. Please review and update if needed.${NC}"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local not found. Creating template...${NC}"
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8483/graphql
EOF
    echo -e "${GREEN}✅ Created frontend/.env.local. Please update with your production URL.${NC}"
fi

# Step 10: Build applications
echo -e "${GREEN}🔨 Building applications...${NC}"
npm run build

# Step 11: Create logs directory
mkdir -p logs

# Step 12: Stop existing PM2 processes if running
echo -e "${GREEN}🛑 Stopping existing PM2 processes...${NC}"
pm2 delete all 2>/dev/null || true

# Step 13: Start applications with PM2
echo -e "${GREEN}🚀 Starting applications with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save

# Step 14: Setup PM2 startup
echo -e "${GREEN}⚙️  Setting up PM2 startup...${NC}"
STARTUP_CMD=$(pm2 startup | grep -o 'sudo.*')
if [ ! -z "$STARTUP_CMD" ]; then
    echo -e "${YELLOW}⚠️  Run this command to enable PM2 startup:${NC}"
    echo "   $STARTUP_CMD"
fi

# Step 15: Configure firewall
echo -e "${GREEN}🔥 Configuring firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. Configure Nginx (see DEPLOYMENT_GUIDE.md)"
echo "2. Update frontend/.env.local with your production API URL"
echo "3. Rebuild frontend: cd frontend && npm run build && pm2 restart veda-frontend"
echo "4. Setup SSL with Let's Encrypt (optional but recommended)"
echo ""
echo -e "${GREEN}📊 Check application status:${NC}"
echo "   pm2 list"
echo "   pm2 logs"
echo ""
echo -e "${GREEN}🌐 Your applications should be running on:${NC}"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8483/graphql"

