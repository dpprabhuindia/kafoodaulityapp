#!/bin/bash

# Food Transparency Portal - Cloud Deployment Script
# Supports AWS ECS, Google Cloud Run, and Azure Container Instances

set -e

echo "☁️  Food Transparency Portal - Cloud Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="food-transparency-portal"
TAG=${2:-latest}
FULL_IMAGE_NAME="${IMAGE_NAME}:${TAG}"

# Function to show usage
show_usage() {
    echo -e "${BLUE}Usage: $0 [PLATFORM] [TAG]${NC}"
    echo ""
    echo "Platforms:"
    echo "  aws-ecs     - Deploy to AWS ECS"
    echo "  gcp-run     - Deploy to Google Cloud Run"
    echo "  azure-aci   - Deploy to Azure Container Instances"
    echo "  k8s         - Deploy to Kubernetes cluster"
    echo "  docker-hub  - Push to Docker Hub"
    echo ""
    echo "Examples:"
    echo "  $0 docker-hub latest"
    echo "  $0 aws-ecs v1.0"
    echo "  $0 gcp-run latest"
}

# Parse command line arguments
PLATFORM=${1:-help}

case $PLATFORM in
    "docker-hub")
        echo -e "${BLUE}🐳 Pushing to Docker Hub...${NC}"
        
        # Build and tag image
        docker build -t "${FULL_IMAGE_NAME}" .
        docker tag "${FULL_IMAGE_NAME}" "your-dockerhub-username/${FULL_IMAGE_NAME}"
        
        # Push to Docker Hub
        echo -e "${BLUE}📤 Pushing image to Docker Hub...${NC}"
        docker push "your-dockerhub-username/${FULL_IMAGE_NAME}"
        
        echo -e "${GREEN}✅ Image pushed to Docker Hub successfully!${NC}"
        echo -e "${BLUE}🌐 Image: your-dockerhub-username/${FULL_IMAGE_NAME}${NC}"
        ;;
        
    "aws-ecs")
        echo -e "${BLUE}🚀 Deploying to AWS ECS...${NC}"
        
        # Check AWS CLI
        if ! command -v aws &> /dev/null; then
            echo -e "${RED}❌ AWS CLI is not installed${NC}"
            exit 1
        fi
        
        # Build and push to ECR
        AWS_REGION=${AWS_REGION:-us-east-1}
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        ECR_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME}"
        
        echo -e "${BLUE}📦 Building and pushing to ECR...${NC}"
        
        # Login to ECR
        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO}
        
        # Build and push
        docker build -t "${FULL_IMAGE_NAME}" .
        docker tag "${FULL_IMAGE_NAME}" "${ECR_REPO}:${TAG}"
        docker push "${ECR_REPO}:${TAG}"
        
        echo -e "${GREEN}✅ Deployed to AWS ECS successfully!${NC}"
        echo -e "${BLUE}🌐 Image: ${ECR_REPO}:${TAG}${NC}"
        ;;
        
    "gcp-run")
        echo -e "${BLUE}🚀 Deploying to Google Cloud Run...${NC}"
        
        # Check gcloud CLI
        if ! command -v gcloud &> /dev/null; then
            echo -e "${RED}❌ Google Cloud CLI is not installed${NC}"
            exit 1
        fi
        
        # Set project and region
        PROJECT_ID=${GCP_PROJECT_ID:-your-project-id}
        REGION=${GCP_REGION:-us-central1}
        
        echo -e "${BLUE}📦 Building and deploying to Cloud Run...${NC}"
        
        # Build and deploy
        gcloud builds submit --tag gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}
        
        gcloud run deploy food-transparency-portal \
            --image gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG} \
            --platform managed \
            --region ${REGION} \
            --allow-unauthenticated \
            --port 80 \
            --memory 512Mi \
            --cpu 1 \
            --max-instances 10
        
        echo -e "${GREEN}✅ Deployed to Google Cloud Run successfully!${NC}"
        ;;
        
    "azure-aci")
        echo -e "${BLUE}🚀 Deploying to Azure Container Instances...${NC}"
        
        # Check Azure CLI
        if ! command -v az &> /dev/null; then
            echo -e "${RED}❌ Azure CLI is not installed${NC}"
            exit 1
        fi
        
        # Set variables
        RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-food-transparency-rg}
        LOCATION=${AZURE_LOCATION:-eastus}
        CONTAINER_NAME="food-transparency-portal"
        
        echo -e "${BLUE}📦 Creating Azure Container Instance...${NC}"
        
        # Create resource group if it doesn't exist
        az group create --name ${RESOURCE_GROUP} --location ${LOCATION}
        
        # Create container instance
        az container create \
            --resource-group ${RESOURCE_GROUP} \
            --name ${CONTAINER_NAME} \
            --image ${FULL_IMAGE_NAME} \
            --dns-name-label food-transparency-portal \
            --ports 80 \
            --cpu 1 \
            --memory 1 \
            --restart-policy Always
        
        echo -e "${GREEN}✅ Deployed to Azure Container Instances successfully!${NC}"
        ;;
        
    "k8s")
        echo -e "${BLUE}🚀 Deploying to Kubernetes...${NC}"
        
        # Check kubectl
        if ! command -v kubectl &> /dev/null; then
            echo -e "${RED}❌ kubectl is not installed${NC}"
            exit 1
        fi
        
        echo -e "${BLUE}📦 Applying Kubernetes manifests...${NC}"
        
        # Apply manifests
        kubectl apply -f k8s/namespace.yaml
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/ingress.yaml
        
        # Wait for deployment
        kubectl rollout status deployment/food-transparency-portal -n food-transparency-portal
        
        echo -e "${GREEN}✅ Deployed to Kubernetes successfully!${NC}"
        
        # Show service info
        kubectl get services -n food-transparency-portal
        ;;
        
    "help"|"-h"|"--help")
        show_usage
        ;;
        
    *)
        echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
        show_usage
        exit 1
        ;;
esac
