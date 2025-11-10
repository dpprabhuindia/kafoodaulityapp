#!/bin/bash

# Food Transparency Portal - Setup Script
# This script sets up the Docker environment and validates the setup

set -e

echo "🔧 Setting up Food Transparency Portal Docker Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Docker installation
echo -e "${BLUE}🐳 Checking Docker installation...${NC}"
if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker is installed: ${DOCKER_VERSION}${NC}"
    
    # Check if Docker daemon is running
    if docker info >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker daemon is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker daemon is not running. Please start Docker Desktop or Docker service.${NC}"
        echo -e "${BLUE}💡 On macOS: Start Docker Desktop application${NC}"
        echo -e "${BLUE}💡 On Linux: sudo systemctl start docker${NC}"
    fi
else
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${BLUE}💡 Install Docker from: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

# Check Docker Compose installation
echo -e "${BLUE}📦 Checking Docker Compose installation...${NC}"
if command_exists docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✅ Docker Compose is installed: ${COMPOSE_VERSION}${NC}"
elif docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✅ Docker Compose (plugin) is installed: ${COMPOSE_VERSION}${NC}"
else
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo -e "${BLUE}💡 Install Docker Compose from: https://docs.docker.com/compose/install/${NC}"
    exit 1
fi

# Check Node.js (for local development)
echo -e "${BLUE}📦 Checking Node.js installation...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js is installed: ${NODE_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js is not installed (optional for Docker deployment)${NC}"
    echo -e "${BLUE}💡 Install Node.js from: https://nodejs.org/${NC}"
fi

# Make scripts executable
echo -e "${BLUE}🔧 Making scripts executable...${NC}"
chmod +x scripts/build.sh
chmod +x scripts/deploy.sh
echo -e "${GREEN}✅ Scripts are now executable${NC}"

# Create necessary directories
echo -e "${BLUE}📁 Creating necessary directories...${NC}"
mkdir -p inspectPhotos
echo -e "${GREEN}✅ Directories created${NC}"

# Validate Docker files
echo -e "${BLUE}📋 Validating Docker configuration...${NC}"

# Check if Dockerfile exists
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile found${NC}"
else
    echo -e "${RED}❌ Dockerfile not found${NC}"
    exit 1
fi

# Check if docker-compose.yml exists
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✅ docker-compose.yml found${NC}"
else
    echo -e "${RED}❌ docker-compose.yml not found${NC}"
    exit 1
fi

# Check if nginx.conf exists
if [ -f "nginx.conf" ]; then
    echo -e "${GREEN}✅ nginx.conf found${NC}"
else
    echo -e "${RED}❌ nginx.conf not found${NC}"
    exit 1
fi

# Validate docker-compose file
if docker info >/dev/null 2>&1; then
    echo -e "${BLUE}🔍 Validating docker-compose configuration...${NC}"
    if docker-compose config >/dev/null 2>&1; then
        echo -e "${GREEN}✅ docker-compose.yml is valid${NC}"
    else
        echo -e "${RED}❌ docker-compose.yml has errors${NC}"
        docker-compose config
        exit 1
    fi
fi

echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. ${YELLOW}Build the Docker image:${NC}"
echo -e "   ./scripts/build.sh"
echo ""
echo -e "2. ${YELLOW}Deploy the application:${NC}"
echo -e "   ./scripts/deploy.sh up"
echo ""
echo -e "3. ${YELLOW}Access the application:${NC}"
echo -e "   http://localhost:3000"
echo ""
echo -e "${BLUE}📖 For more information, see DOCKER_README.md${NC}"
