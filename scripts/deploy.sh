#!/bin/bash

# Food Transparency Portal - Deployment Script
# This script deploys the application using Docker Compose

set -e

echo "🚀 Deploying Food Transparency Portal..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="food-transparency-portal"

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage: $0 [COMMAND]${NC}"
    echo ""
    echo "Commands:"
    echo "  up      - Start the application (default)"
    echo "  down    - Stop the application"
    echo "  restart - Restart the application"
    echo "  logs    - Show application logs"
    echo "  status  - Show container status"
    echo "  clean   - Stop and remove containers, networks, and volumes"
}

# Parse command line arguments
COMMAND=${1:-up}

case $COMMAND in
    "up")
        echo -e "${BLUE}🔄 Starting Food Transparency Portal...${NC}"
        docker-compose -p "${PROJECT_NAME}" up -d
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Application started successfully!${NC}"
            echo -e "${BLUE}🌐 Application is available at: http://localhost:3000${NC}"
            echo -e "${YELLOW}💡 Use 'docker-compose logs -f' to view logs${NC}"
            
            # Show container status
            echo -e "${BLUE}📊 Container Status:${NC}"
            docker-compose -p "${PROJECT_NAME}" ps
        else
            echo -e "${RED}❌ Failed to start application!${NC}"
            exit 1
        fi
        ;;
        
    "down")
        echo -e "${BLUE}🛑 Stopping Food Transparency Portal...${NC}"
        docker-compose -p "${PROJECT_NAME}" down
        echo -e "${GREEN}✅ Application stopped successfully!${NC}"
        ;;
        
    "restart")
        echo -e "${BLUE}🔄 Restarting Food Transparency Portal...${NC}"
        docker-compose -p "${PROJECT_NAME}" down
        docker-compose -p "${PROJECT_NAME}" up -d
        echo -e "${GREEN}✅ Application restarted successfully!${NC}"
        echo -e "${BLUE}🌐 Application is available at: http://localhost:3000${NC}"
        ;;
        
    "logs")
        echo -e "${BLUE}📋 Showing application logs...${NC}"
        docker-compose -p "${PROJECT_NAME}" logs -f
        ;;
        
    "status")
        echo -e "${BLUE}📊 Container Status:${NC}"
        docker-compose -p "${PROJECT_NAME}" ps
        ;;
        
    "clean")
        echo -e "${YELLOW}⚠️  This will remove all containers, networks, and volumes!${NC}"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}🧹 Cleaning up...${NC}"
            docker-compose -p "${PROJECT_NAME}" down -v --remove-orphans
            docker system prune -f
            echo -e "${GREEN}✅ Cleanup completed!${NC}"
        else
            echo -e "${YELLOW}❌ Cleanup cancelled.${NC}"
        fi
        ;;
        
    "help"|"-h"|"--help")
        show_usage
        ;;
        
    *)
        echo -e "${RED}❌ Unknown command: $COMMAND${NC}"
        show_usage
        exit 1
        ;;
esac
