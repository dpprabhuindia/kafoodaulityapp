# 🐳 Food Transparency Portal - Docker Deployment Guide

This guide will help you build and deploy the Food Transparency Portal using Docker containers.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

### Installing Docker

#### On macOS:
```bash
# Install Docker Desktop
brew install --cask docker
```

#### On Ubuntu/Debian:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd windsurf-project
```

### 2. Make Scripts Executable
```bash
chmod +x scripts/build.sh
chmod +x scripts/deploy.sh
```

### 3. Build and Deploy
```bash
# Build the Docker image
./scripts/build.sh

# Deploy the application
./scripts/deploy.sh up
```

### 4. Access the Application
Open your browser and navigate to: **http://localhost:3000**

## 📁 Docker Files Overview

### Core Files
- `Dockerfile` - Production build configuration
- `Dockerfile.dev` - Development build configuration
- `docker-compose.yml` - Production deployment
- `docker-compose.dev.yml` - Development deployment
- `nginx.conf` - Nginx web server configuration
- `.dockerignore` - Files to exclude from Docker build

### Scripts
- `scripts/build.sh` - Build Docker images
- `scripts/deploy.sh` - Deploy and manage containers

## 🛠️ Deployment Options

### Production Deployment

#### Using Docker Compose (Recommended)
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Using Docker Run
```bash
# Build the image
docker build -t food-transparency-portal .

# Run the container
docker run -d \
  --name food-transparency-portal \
  -p 3000:80 \
  -v inspection_photos:/usr/share/nginx/html/inspectPhotos \
  food-transparency-portal:latest
```

### Development Deployment

For development with hot reloading:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🔧 Management Commands

### Using the Deploy Script

```bash
# Start the application
./scripts/deploy.sh up

# Stop the application
./scripts/deploy.sh down

# Restart the application
./scripts/deploy.sh restart

# View logs
./scripts/deploy.sh logs

# Check container status
./scripts/deploy.sh status

# Clean up everything
./scripts/deploy.sh clean
```

### Manual Docker Commands

```bash
# Build image with custom tag
docker build -t food-transparency-portal:v1.0 .

# List images
docker images food-transparency-portal

# Remove image
docker rmi food-transparency-portal:latest

# View container logs
docker logs food-transparency-portal

# Execute commands in container
docker exec -it food-transparency-portal sh
```

## 📊 Container Architecture

### Production Setup
```
┌─────────────────────────────────────┐
│           Load Balancer             │
│            (Optional)               │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Nginx Container             │
│    (food-transparency-portal)       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      React App              │    │
│  │   (Static Files)            │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Inspection Photos         │    │
│  │     (Volume Mount)          │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### Development Setup
```
┌─────────────────────────────────────┐
│       Development Container         │
│  (food-transparency-portal-dev)     │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    React Dev Server         │    │
│  │   (Hot Reloading)           │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │   Source Code               │    │
│  │   (Volume Mount)            │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## 🔒 Security Features

### Nginx Security Headers
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy configured
- Referrer-Policy: no-referrer-when-downgrade

### Container Security
- Non-root user execution
- Minimal Alpine Linux base image
- Health checks enabled
- Resource limits (can be configured)

## 📈 Monitoring & Health Checks

### Health Check Endpoints
- **Application**: `http://localhost:3000/health`
- **Container**: Built-in Docker health checks

### Monitoring Commands
```bash
# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View resource usage
docker stats food-transparency-portal

# Check logs
docker logs -f food-transparency-portal
```

## 🗂️ Data Persistence

### Volumes
- `inspection_photos` - Stores uploaded inspection photos
- Persistent across container restarts and updates

### Backup Commands
```bash
# Backup inspection photos
docker run --rm -v inspection_photos:/data -v $(pwd):/backup alpine tar czf /backup/inspection_photos_backup.tar.gz -C /data .

# Restore inspection photos
docker run --rm -v inspection_photos:/data -v $(pwd):/backup alpine tar xzf /backup/inspection_photos_backup.tar.gz -C /data
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### Container Won't Start
```bash
# Check container logs
docker logs food-transparency-portal

# Check Docker daemon status
docker system info
```

#### Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t food-transparency-portal .
```

### Debug Mode
```bash
# Run container in interactive mode
docker run -it --rm food-transparency-portal sh

# Access running container
docker exec -it food-transparency-portal sh
```

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and redeploy
./scripts/build.sh
./scripts/deploy.sh restart
```

### Cleaning Up
```bash
# Remove unused containers and images
docker system prune -a

# Remove specific image
docker rmi food-transparency-portal:old-tag
```

## 🌐 Production Considerations

### Environment Variables
Create a `.env` file for production settings:
```env
NODE_ENV=production
PORT=80
REACT_APP_API_URL=https://api.yourdomain.com
```

### SSL/HTTPS Setup
For production, consider using:
- Reverse proxy (Nginx, Traefik)
- SSL certificates (Let's Encrypt)
- Load balancer

### Scaling
```bash
# Scale containers
docker-compose up -d --scale food-transparency-portal=3
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review container logs
3. Verify Docker installation
4. Check system resources

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
