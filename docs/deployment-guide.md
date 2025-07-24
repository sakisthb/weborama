# Ads Pro Platform - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Ads Pro Platform to production environments. The platform is designed as a high-performance, enterprise-grade SaaS application with advanced multi-touch attribution and campaign optimization capabilities.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Infrastructure Deployment](#infrastructure-deployment)
4. [Application Deployment](#application-deployment)
5. [Configuration](#configuration)
6. [Security Setup](#security-setup)
7. [Monitoring and Logging](#monitoring-and-logging)
8. [Backup and Recovery](#backup-and-recovery)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

## Prerequisites

### Required Tools
- Docker 24.0+
- Kubernetes 1.28+
- kubectl configured for your cluster
- Helm 3.0+
- PostgreSQL 15+
- Redis 7.0+
- NGINX or similar reverse proxy
- SSL/TLS certificates

### Cloud Provider Requirements
- **AWS**: EKS cluster, RDS PostgreSQL, ElastiCache Redis, S3 buckets
- **GCP**: GKE cluster, Cloud SQL, Memorystore Redis, Cloud Storage
- **Azure**: AKS cluster, Azure Database, Azure Cache, Blob Storage

### API Access
- Meta Business API (Facebook/Instagram Ads)
- Google Ads API
- TikTok Marketing API
- LinkedIn Marketing API

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/ads-pro-platform.git
cd ads-pro-platform/ui
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.production

# Edit production configuration
nano .env.production
```

### 3. Required Environment Variables
```env
# Application
NODE_ENV=production
VITE_APP_VERSION=1.0.0
VITE_APP_BASE_URL=https://ads-pro-platform.com

# Database
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_DB=ads_pro_platform
POSTGRES_USER=your-db-user
POSTGRES_PASSWORD=your-secure-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Keys
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-google-developer-token
GOOGLE_ADS_CLIENT_ID=your-google-client-id
GOOGLE_ADS_CLIENT_SECRET=your-google-client-secret
TIKTOK_APP_ID=your-tiktok-app-id
TIKTOK_SECRET=your-tiktok-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Security
JWT_SECRET=your-jwt-secret-min-256-bits
ENCRYPTION_KEY=your-encryption-key-32-bytes
CSRF_SECRET=your-csrf-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=your-grafana-password

# Backup
AWS_S3_BACKUP_BUCKET=ads-pro-platform-backups
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
BACKUP_WEBHOOK_URL=your-backup-webhook-url
```

## Infrastructure Deployment

### 1. Kubernetes Cluster Setup

#### AWS EKS
```bash
# Create EKS cluster
eksctl create cluster \
  --name ads-pro-platform \
  --region us-west-2 \
  --node-type m5.large \
  --nodes 3 \
  --nodes-min 3 \
  --nodes-max 10 \
  --with-oidc \
  --ssh-access \
  --ssh-public-key your-key-name \
  --managed
```

#### Google GKE
```bash
# Create GKE cluster
gcloud container clusters create ads-pro-platform \
  --zone us-central1-a \
  --machine-type n1-standard-2 \
  --num-nodes 3 \
  --min-nodes 3 \
  --max-nodes 10 \
  --enable-autoscaling \
  --enable-autorepair \
  --enable-autoupgrade
```

### 2. Install Required Components

#### NGINX Ingress Controller
```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

#### Cert-Manager for SSL
```bash
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0 \
  --set installCRDs=true
```

#### Prometheus & Grafana
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  --set grafana.adminPassword=your-grafana-password
```

### 3. Database Setup

#### PostgreSQL (RDS/Cloud SQL)
```sql
-- Create database and user
CREATE DATABASE ads_pro_platform;
CREATE USER ads_pro_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE ads_pro_platform TO ads_pro_user;

-- Enable required extensions
\c ads_pro_platform;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### Redis Configuration
```redis
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru
timeout 300
tcp-keepalive 300
```

## Application Deployment

### 1. Build and Push Docker Image
```bash
# Build production image
docker build -t your-registry/ads-pro-platform:latest .

# Push to registry
docker push your-registry/ads-pro-platform:latest
```

### 2. Create Kubernetes Secrets
```bash
# Database credentials
kubectl create secret generic database-credentials \
  --namespace production \
  --from-literal=host=your-postgres-host \
  --from-literal=port=5432 \
  --from-literal=database=ads_pro_platform \
  --from-literal=username=ads_pro_user \
  --from-literal=password=your-secure-password

# API credentials
kubectl create secret generic api-credentials \
  --namespace production \
  --from-literal=meta-app-id=your-meta-app-id \
  --from-literal=meta-app-secret=your-meta-app-secret \
  --from-literal=google-ads-developer-token=your-google-token \
  --from-literal=google-ads-client-id=your-google-client-id \
  --from-literal=google-ads-client-secret=your-google-secret

# Backup credentials
kubectl create secret generic backup-credentials \
  --namespace production \
  --from-literal=aws-access-key-id=your-aws-access-key \
  --from-literal=aws-secret-access-key=your-aws-secret-key \
  --from-literal=webhook-url=your-backup-webhook-url
```

### 3. Deploy Application
```bash
# Create namespace
kubectl create namespace production

# Apply base deployment
kubectl apply -f k8s/base/deployment.yaml

# Apply production-specific configurations
kubectl apply -f k8s/production/

# Verify deployment
kubectl get pods -n production
kubectl get services -n production
kubectl get ingress -n production
```

### 4. Configure DNS
Point your domain to the Load Balancer IP:
```bash
# Get Load Balancer IP
kubectl get service ingress-nginx-controller -n ingress-nginx

# Update DNS records
# A record: ads-pro-platform.com -> [LOAD_BALANCER_IP]
# A record: www.ads-pro-platform.com -> [LOAD_BALANCER_IP]
# A record: api.ads-pro-platform.com -> [LOAD_BALANCER_IP]
```

## Configuration

### 1. Application Configuration
Update the ConfigMap for production settings:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ads-pro-platform-config
  namespace: production
data:
  NODE_ENV: "production"
  VITE_LOG_LEVEL: "warn"
  VITE_PERFORMANCE_MONITORING_ENABLED: "true"
  VITE_ANALYTICS_ENABLED: "true"
  VITE_REAL_API_INTEGRATION: "true"
  VITE_ADVANCED_FEATURES: "true"
```

### 2. Ingress Configuration
Ensure SSL termination and security headers:
```yaml
# Applied automatically from k8s/production/ingress.yaml
# Includes:
# - SSL/TLS termination
# - Security headers
# - Rate limiting
# - CORS configuration
```

### 3. Auto-scaling Configuration
```yaml
# HPA is configured in k8s/base/deployment.yaml
# Metrics:
# - CPU: 70% utilization
# - Memory: 80% utilization
# - Min replicas: 3
# - Max replicas: 10
```

## Security Setup

### 1. Network Policies
```bash
# Apply network policies for production
kubectl apply -f k8s/production/network-policies.yaml
```

### 2. Pod Security Standards
```bash
# Enable Pod Security Standards
kubectl label namespace production \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/audit=restricted \
  pod-security.kubernetes.io/warn=restricted
```

### 3. RBAC Configuration
```bash
# Apply RBAC policies
kubectl apply -f k8s/production/rbac.yaml
```

### 4. Security Scanning
```bash
# Scan images with Trivy
trivy image your-registry/ads-pro-platform:latest

# Check for vulnerabilities
kubectl get vulnerabilityreports -n production
```

## Monitoring and Logging

### 1. Access Monitoring Dashboards
```bash
# Grafana dashboard
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
# Open http://localhost:3000
# Login: admin / your-grafana-password

# Prometheus
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
# Open http://localhost:9090
```

### 2. Log Aggregation
```bash
# Install Fluent Bit for log collection
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit \
  --namespace logging \
  --create-namespace
```

### 3. Alerting Setup
Configure alerting rules in Prometheus:
```yaml
# Applied from monitoring/prometheus-rules.yaml
# Alerts for:
# - High error rate
# - High latency
# - High resource usage
# - Failed backups
# - Security violations
```

## Backup and Recovery

### 1. Automated Backups
```bash
# Backup CronJobs are automatically deployed
# Check backup status
kubectl get cronjobs -n production
kubectl get jobs -n production
```

### 2. Manual Backup
```bash
# Create manual backup
./scripts/backup-automation.sh backup full

# Verify backup
./scripts/backup-automation.sh verify /path/to/backup.dump

# Test restore
./scripts/backup-automation.sh test-restore /path/to/backup.dump
```

### 3. Disaster Recovery
```bash
# Execute recovery plan
kubectl exec -it deployment/ads-pro-platform -n production -- \
  node -e "
    const { backupRecovery } = require('./dist/lib/backup-recovery.js');
    backupRecovery.executeRecoveryPlan('db_corruption', false);
  "
```

## Performance Optimization

### 1. CDN Setup
Configure CloudFront or similar CDN:
```bash
# Static assets should be served from CDN
# Configure origin: https://ads-pro-platform.com
# Cache policies for CSS, JS, images
```

### 2. Database Optimization
```sql
-- Enable query optimization
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX CONCURRENTLY idx_analytics_campaign_id ON analytics(campaign_id);
CREATE INDEX CONCURRENTLY idx_reports_created_at ON reports(created_at);
```

### 3. Redis Optimization
```redis
# Memory optimization
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET maxmemory 2gb

# Connection optimization
CONFIG SET timeout 300
CONFIG SET tcp-keepalive 300
```

## Troubleshooting

### Common Issues

#### 1. Pod CrashLoopBackOff
```bash
# Check pod logs
kubectl logs -f deployment/ads-pro-platform -n production

# Describe pod for events
kubectl describe pod <pod-name> -n production

# Check resource limits
kubectl top pods -n production
```

#### 2. Database Connection Issues
```bash
# Test database connectivity
kubectl exec -it deployment/ads-pro-platform -n production -- \
  pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT

# Check database credentials
kubectl get secret database-credentials -n production -o yaml
```

#### 3. SSL Certificate Issues
```bash
# Check certificate status
kubectl describe certificate ads-pro-platform-tls -n production

# Check cert-manager logs
kubectl logs -f deployment/cert-manager -n cert-manager
```

#### 4. High Memory Usage
```bash
# Check memory usage
kubectl top pods -n production

# Scale up if needed
kubectl scale deployment ads-pro-platform --replicas=5 -n production
```

### Debugging Commands
```bash
# Application logs
kubectl logs -f deployment/ads-pro-platform -n production

# Database logs (if using Cloud SQL Proxy)
kubectl logs -f deployment/cloudsql-proxy -n production

# Ingress logs
kubectl logs -f deployment/ingress-nginx-controller -n ingress-nginx

# Check all resources
kubectl get all -n production

# Check events
kubectl get events -n production --sort-by='.lastTimestamp'
```

## Maintenance

### 1. Regular Updates
```bash
# Update application
docker build -t your-registry/ads-pro-platform:v1.1.0 .
docker push your-registry/ads-pro-platform:v1.1.0
kubectl set image deployment/ads-pro-platform \
  ads-pro-platform=your-registry/ads-pro-platform:v1.1.0 \
  -n production

# Update Kubernetes components
kubectl apply -f k8s/production/
```

### 2. Backup Verification
```bash
# Weekly backup verification
./scripts/backup-automation.sh verify latest
./scripts/backup-automation.sh test-restore latest
```

### 3. Security Updates
```bash
# Scan for vulnerabilities
trivy image your-registry/ads-pro-platform:latest

# Update base images
docker build --pull -t your-registry/ads-pro-platform:latest .
```

### 4. Performance Monitoring
```bash
# Check performance metrics
kubectl exec -it deployment/ads-pro-platform -n production -- \
  curl -s http://localhost:8080/metrics

# Lighthouse performance audit
npx lighthouse https://ads-pro-platform.com --output json
```

### 5. Capacity Planning
```bash
# Monitor resource usage trends
kubectl top nodes
kubectl top pods -n production

# Check HPA status
kubectl get hpa -n production
```

## Health Checks

### Application Health
```bash
# Health endpoint
curl https://ads-pro-platform.com/health

# Detailed status
curl https://ads-pro-platform.com/status
```

### Database Health
```bash
# Connection test
kubectl exec -it deployment/ads-pro-platform -n production -- \
  pg_isready -h $POSTGRES_HOST

# Performance check
kubectl exec -it deployment/ads-pro-platform -n production -- \
  psql -h $POSTGRES_HOST -U $POSTGRES_USER -c "SELECT version();"
```

### Redis Health
```bash
# Redis ping
kubectl exec -it deployment/ads-pro-platform -n production -- \
  redis-cli -h $REDIS_HOST ping
```

## Support and Resources

### Documentation
- [API Documentation](./api-documentation.md)
- [Architecture Overview](./architecture.md)
- [Security Guide](./security-guide.md)
- [Performance Guide](./performance-guide.md)

### Support Channels
- Technical Support: tech-support@ads-pro-platform.com
- Emergency Contact: +1-555-EMERGENCY
- Slack Channel: #ads-pro-platform-ops

### Monitoring Dashboards
- Grafana: https://monitoring.ads-pro-platform.com
- Prometheus: https://prometheus.ads-pro-platform.com
- Application Logs: https://logs.ads-pro-platform.com

---

**Note**: This deployment guide assumes familiarity with Kubernetes, Docker, and cloud platforms. For additional support, contact the development team or refer to the troubleshooting section.