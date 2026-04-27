# ARC Drive - CI/CD Pipeline for team7
# team members
SAMRUDH

Automated deployment pipeline: **GitHub → Jenkins → Docker → AWS EC2**

## Quick Setup

### 1. Fix Jenkins Docker Permissions (IMPORTANT)
```bash
# Run this on your Jenkins server
chmod +x jenkins-docker-setup.sh
./jenkins-docker-setup.sh
```

### 2. EC2 Instance Setup
```bash
# Run on your EC2 instance
chmod +x ec2-setup.sh
./ec2-setup.sh
```

### 3. Jenkins Configuration
1. Install Jenkins with Docker support
2. Add credentials:
   - `ec2-host`: Your EC2 public IP
   - `ec2-ssh-key`: SSH private key for EC2
3. Create new Pipeline job pointing to this repository

### 4. GitHub Webhook
1. Repository Settings → Webhooks → Add webhook
2. URL: `http://YOUR_JENKINS_URL/github-webhook/`
3. Content type: `application/json`
4. Events: Push events

## Pipeline Flow
1. Push code to GitHub
2. GitHub triggers Jenkins via webhook
3. Jenkins builds Docker image
4. Jenkins deploys to EC2 (or locally for testing)
5. Application accessible via EC2 public IP or localhost:8080

## Troubleshooting

### Docker Permission Error
If you see "permission denied while trying to connect to the Docker daemon":
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Local Testing
Without EC2 credentials, the pipeline will deploy locally at `http://localhost:8080`

## Files Structure
- `Jenkinsfile` - CI/CD pipeline configuration
- `Dockerfile` - Multi-stage Docker build
- `jenkins-docker-setup.sh` - Fix Jenkins Docker permissions
- `ec2-setup.sh` - EC2 instance preparation script
