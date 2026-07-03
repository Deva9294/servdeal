#!/bin/bash
# ServDeal Production Deployment Script
# This script helps automate the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 ServDeal Production Deployment Script${NC}"
echo "==========================================="

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root directory${NC}"
    exit 1
fi

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "\n${YELLOW}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js v20+${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git not found. Please install Git${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
echo -e "${GREEN}✓ Git $(git -v | cut -d' ' -f3)${NC}"

# Get deployment environment
echo -e "\n${YELLOW}🌍 Select deployment environment:${NC}"
echo "1) Render.com"
echo "2) Vercel (Frontend only)"
echo "3) Docker (Self-hosted)"
echo "4) Local Testing"
read -p "Enter choice (1-4): " ENV_CHOICE

case $ENV_CHOICE in
    1)
        DEPLOY_ENV="render"
        echo -e "${GREEN}✓ Selected: Render.com${NC}"
        ;;
    2)
        DEPLOY_ENV="vercel"
        echo -e "${GREEN}✓ Selected: Vercel${NC}"
        ;;
    3)
        DEPLOY_ENV="docker"
        echo -e "${GREEN}✓ Selected: Docker${NC}"
        ;;
    4)
        DEPLOY_ENV="local"
        echo -e "${GREEN}✓ Selected: Local Testing${NC}"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

# Build checks
echo -e "\n${YELLOW}🔨 Building application...${NC}"

echo "Building backend..."
cd backend
npm install || { echo -e "${RED}❌ Backend npm install failed${NC}"; exit 1; }
npm run build || { echo -e "${RED}❌ Backend build failed${NC}"; exit 1; }
cd ..
echo -e "${GREEN}✓ Backend built successfully${NC}"

echo "Building frontend..."
cd frontend
npm install || { echo -e "${RED}❌ Frontend npm install failed${NC}"; exit 1; }
npm run build || { echo -e "${RED}❌ Frontend build failed${NC}"; exit 1; }
cd ..
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Environment-specific deployments
case $DEPLOY_ENV in
    render)
        echo -e "\n${YELLOW}📤 Deploying to Render.com...${NC}"
        
        if ! command_exists render; then
            echo -e "${YELLOW}ℹ️  Render CLI not found. Manual deployment required.${NC}"
            echo "Visit: https://dashboard.render.com"
            echo "Push changes and Render will auto-deploy via GitHub integration"
        else
            render deploy
        fi
        ;;
    
    vercel)
        echo -e "\n${YELLOW}📤 Deploying to Vercel...${NC}"
        
        if ! command_exists vercel; then
            echo -e "${RED}❌ Vercel CLI not found. Install with: npm i -g vercel${NC}"
            exit 1
        fi
        
        vercel --prod --cwd frontend
        ;;
    
    docker)
        echo -e "\n${YELLOW}📦 Building Docker images...${NC}"
        
        if ! command_exists docker; then
            echo -e "${RED}❌ Docker not found. Please install Docker${NC}"
            exit 1
        fi
        
        docker compose build
        echo -e "${GREEN}✓ Docker images built${NC}"
        
        echo -e "\n${YELLOW}🚀 Starting Docker services...${NC}"
        docker compose up -d
        echo -e "${GREEN}✓ Services started${NC}"
        
        # Wait for services to be ready
        echo -e "\n${YELLOW}⏳ Waiting for services to start...${NC}"
        sleep 5
        
        # Health check
        echo -e "\n${YELLOW}🏥 Checking service health...${NC}"
        if curl -s http://localhost:5000/api/v1/health >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Backend healthy${NC}"
        else
            echo -e "${RED}❌ Backend health check failed${NC}"
        fi
        ;;
    
    local)
        echo -e "\n${YELLOW}🏠 Running locally...${NC}"
        echo "Backend runs on: http://localhost:5000"
        echo "Frontend runs on: http://localhost:3000"
        echo ""
        echo "Start with: npm run dev"
        ;;
esac

# Post-deployment checks
echo -e "\n${YELLOW}🔍 Post-deployment checks...${NC}"

# Check git status
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}ℹ️  Uncommitted changes detected. Don't forget to commit!${NC}"
else
    echo -e "${GREEN}✓ All changes committed${NC}"
fi

# Display deployment summary
echo -e "\n${GREEN}✅ Deployment Process Complete!${NC}"
echo "==========================================="
echo "Environment: $DEPLOY_ENV"
echo "Timestamp: $(date)"
echo ""
echo "Next steps:"
echo "1. Verify services are running"
echo "2. Test API endpoints"
echo "3. Check database connectivity"
echo "4. Monitor logs for errors"
echo ""
echo "For more details, see: PRODUCTION_DEPLOYMENT.md"
