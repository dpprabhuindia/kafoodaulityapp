# 🚀 Food Transparency Portal - Complete Deployment Guide

This comprehensive guide covers all deployment options for the Food Transparency Portal, from local development to production cloud deployments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [Cloud Deployments](#cloud-deployments)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Node.js** (18+) - for local development
- **Git** - for version control

### Cloud CLI Tools (for cloud deployments)
- **AWS CLI** - for AWS deployments
- **Google Cloud CLI** - for GCP deployments
- **Azure CLI** - for Azure deployments
- **kubectl** - for Kubernetes deployments

## 🏠 Local Development

### Quick Start
```bash
# Clone and setup
git clone <repository-url>
cd windsurf-project
./scripts/setup.sh

# Development with hot reloading
docker-compose -f docker-compose.dev.yml up -d

# Access: http://localhost:3000
```

### Development Features
- ✅ Hot reloading
- ✅ Source code mounting
- ✅ Development tools
- ✅ Debug capabilities

## 🏭 Production Deployment

### Option 1: Docker Compose (Recommended for VPS/Dedicated Servers)

```bash
# Basic production deployment
./scripts/build.sh
./scripts/deploy.sh up

# With SSL and monitoring
docker-compose -f docker-compose.prod.yml up -d
```

**Features:**
- Nginx reverse proxy
- SSL/TLS termination
- Health checks
- Log aggregation
- Monitoring with Prometheus/Grafana

### Option 2: Standalone Docker

```bash
# Build and run
docker build -t food-transparency-portal .
docker run -d \
  --name food-transparency-portal \
  -p 3000:80 \
  -v inspection_photos:/usr/share/nginx/html/inspectPhotos \
  food-transparency-portal:latest
```

## ☁️ Cloud Deployments

### AWS ECS Deployment

```bash
# Prerequisites
aws configure
export AWS_REGION=us-east-1

# Deploy
./scripts/deploy-cloud.sh aws-ecs latest
```

**AWS Resources Created:**
- ECS Cluster
- ECS Service
- Application Load Balancer
- ECR Repository
- CloudWatch Logs

### Google Cloud Run

```bash
# Prerequisites
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy
./scripts/deploy-cloud.sh gcp-run latest
```

**GCP Resources:**
- Cloud Run Service
- Container Registry
- Cloud Load Balancer
- Cloud Logging

### Azure Container Instances

```bash
# Prerequisites
az login
export AZURE_RESOURCE_GROUP=food-transparency-rg

# Deploy
./scripts/deploy-cloud.sh azure-aci latest
```

**Azure Resources:**
- Container Instance
- Resource Group
- Public IP
- DNS Label

### Kubernetes Deployment

```bash
# Prerequisites
kubectl config current-context

# Deploy
./scripts/deploy-cloud.sh k8s latest
```

**Kubernetes Resources:**
- Namespace
- Deployment (3 replicas)
- Service
- Ingress
- PersistentVolumeClaim

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Application health
curl http://localhost:3000/health

# Container health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Logging
```bash
# View logs
./scripts/deploy.sh logs

# Follow logs
docker-compose logs -f
```

### Backup & Restore
```bash
# Backup inspection photos
docker run --rm \
  -v inspection_photos:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/photos-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore photos
docker run --rm \
  -v inspection_photos:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/photos-backup-YYYYMMDD.tar.gz -C /data
```

### Updates
```bash
# Update application
git pull origin main
./scripts/build.sh
./scripts/deploy.sh restart
```

## 🔒 Security Considerations

### Production Security Checklist

#### Container Security
- ✅ Non-root user execution
- ✅ Minimal base image (Alpine Linux)
- ✅ No sensitive data in images
- ✅ Regular security updates

#### Network Security
- ✅ HTTPS/SSL encryption
- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ Rate limiting enabled

#### Data Security
- ✅ Encrypted data at rest
- ✅ Secure file uploads
- ✅ Input validation
- ✅ XSS protection

### SSL/TLS Setup

#### Let's Encrypt with Traefik
```yaml
# In docker-compose.prod.yml
traefik:
  command:
    - --certificatesresolvers.letsencrypt.acme.email=admin@your-domain.com
    - --certificatesresolvers.letsencrypt.acme.storage=/ssl-certs/acme.json
```

#### Custom SSL Certificates
```bash
# Mount certificates
volumes:
  - ./ssl-certs:/ssl-certs:ro
```

### Environment Variables
```bash
# Copy and configure
cp .env.example .env
# Edit .env with your settings
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Application port | `80` |
| `MAX_FILE_SIZE` | Max upload size | `10MB` |
| `CORS_ORIGIN` | CORS origin | `*` |
| `LOG_LEVEL` | Logging level | `info` |

### Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `ENABLE_ADMIN_PANEL` | Admin functionality | `true` |
| `ENABLE_PHOTO_UPLOAD` | Photo uploads | `true` |
| `ENABLE_REPORTS` | Reports module | `true` |
| `ENABLE_ANALYTICS` | Analytics tracking | `false` |

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

#### Container Won't Start
```bash
# Check logs
docker logs food-transparency-portal

# Check resources
docker system df
docker system prune
```

#### Build Failures
```bash
# Clean build
docker system prune -a
docker build --no-cache -t food-transparency-portal .
```

#### Permission Issues
```bash
# Fix permissions
sudo chown -R $USER:$USER inspectPhotos/
chmod -R 755 inspectPhotos/
```

### Performance Issues

#### High Memory Usage
```bash
# Check container stats
docker stats

# Limit memory
docker run --memory=512m food-transparency-portal
```

#### Slow Response Times
```bash
# Enable gzip compression (already configured)
# Check nginx logs
docker logs food-transparency-portal 2>&1 | grep nginx
```

### Debug Mode
```bash
# Run in debug mode
docker run -it --rm food-transparency-portal sh

# Access running container
docker exec -it food-transparency-portal sh
```

## 📈 Scaling & Performance

### Horizontal Scaling

#### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml food-portal
```

#### Kubernetes
```bash
# Scale deployment
kubectl scale deployment food-transparency-portal --replicas=5 -n food-transparency-portal
```

### Load Balancing

#### Nginx Load Balancer
```nginx
upstream food_portal {
    server app1:80;
    server app2:80;
    server app3:80;
}
```

#### Cloud Load Balancers
- **AWS**: Application Load Balancer
- **GCP**: Cloud Load Balancing
- **Azure**: Application Gateway

### Performance Optimization

#### Caching
- Static asset caching (1 year)
- Gzip compression enabled
- Browser caching headers

#### CDN Integration
```bash
# AWS CloudFront
aws cloudfront create-distribution

# Google Cloud CDN
gcloud compute backend-services create

# Azure CDN
az cdn profile create
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Food Transparency Portal
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          ./scripts/build.sh
          ./scripts/deploy-cloud.sh docker-hub latest
```

### GitLab CI Example
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE .
    - docker push $CI_REGISTRY_IMAGE

deploy:
  stage: deploy
  script:
    - ./scripts/deploy-cloud.sh k8s latest
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

#### Weekly
- [ ] Check application logs
- [ ] Monitor resource usage
- [ ] Backup inspection photos
- [ ] Review security alerts

#### Monthly
- [ ] Update base images
- [ ] Review and rotate secrets
- [ ] Performance analysis
- [ ] Security audit

#### Quarterly
- [ ] Dependency updates
- [ ] Disaster recovery test
- [ ] Capacity planning
- [ ] Security penetration test

### Monitoring Alerts

#### Application Metrics
- Response time > 2 seconds
- Error rate > 1%
- Memory usage > 80%
- Disk usage > 85%

#### Infrastructure Metrics
- CPU usage > 80%
- Network latency > 100ms
- SSL certificate expiry < 30 days
- Failed health checks

## 📝 Changelog & Versioning

### Version Format
- **Major.Minor.Patch** (e.g., 1.2.3)
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

### Release Process
1. Update version in package.json
2. Create release notes
3. Build and test
4. Deploy to staging
5. Deploy to production
6. Tag release in Git

---

## 🎯 Quick Reference

### Essential Commands
```bash
# Setup
./scripts/setup.sh

# Build
./scripts/build.sh

# Deploy locally
./scripts/deploy.sh up

# Deploy to cloud
./scripts/deploy-cloud.sh [platform] [tag]

# View logs
./scripts/deploy.sh logs

# Clean up
./scripts/deploy.sh clean
```

### Important URLs
- **Local**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Admin Panel**: http://localhost:3000/admin (admin/admin123)

### Support Contacts
- **Technical Issues**: Create GitHub issue
- **Security Issues**: security@your-domain.com
- **General Support**: support@your-domain.com

---

*Last updated: $(date)*
