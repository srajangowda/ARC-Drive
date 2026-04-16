# ARC Drive - CI/CD Pipeline

Automated deployment pipeline: **GitHub → Jenkins → Docker → AWS EC2**

## Quick Setup

### 1. EC2 Instance Setup
```bash
# Run on your EC2 instance
chmod +x ec2-setup.sh
./ec2-setup.sh
```

### 2. Jenkins Configuration
1. Install Jenkins with Docker support
2. Add credentials:
   - `ec2-host`: Your EC2 public IP
   - `ec2-ssh-key`: SSH private key for EC2
3. Create new Pipeline job pointing to this repository

### 3. GitHub Webhook
1. Repository Settings → Webhooks → Add webhook
2. URL: `http://YOUR_JENKINS_URL/github-webhook/`
3. Content type: `application/json`
4. Events: Push events

## Pipeline Flow
1. Push code to GitHub
2. GitHub triggers Jenkins via webhook
3. Jenkins builds Docker image
4. Jenkins deploys to EC2
5. Application accessible via EC2 public IP

## Files Structure
- `Jenkinsfile` - CI/CD pipeline configuration
- `Dockerfile` - Multi-stage Docker build
- `ec2-setup.sh` - EC2 instance preparation script