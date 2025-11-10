#!/bin/bash

# Food Transparency Portal - Build Script
# This script builds the Docker container for the application

set -e

echo "🏗️  Building Food Transparency Portal Container..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="food-transparency-portal"
TAG=${1:-latest}
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

echo -e "${BLUE}📦 Building image: ${FULL_IMAGE_NAME}${NC}"

# Build the Docker image
docker build -t "${FULL_IMAGE_NAME}" .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo -e "${BLUE}📊 Image details:${NC}"
    docker images "${IMAGE_NAME}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo -e "${YELLOW}💡 To run the container:${NC}"
    echo -e "   docker run -p 3000:80 ${FULL_IMAGE_NAME}"
    echo -e "${YELLOW}💡 Or use docker-compose:${NC}"
    echo -e "   docker-compose up -d"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
