# GitHub Webhook Configuration for Jenkins

## Setup Instructions:

1. **In GitHub Repository:**
   - Go to Settings → Webhooks
   - Click "Add webhook"
   - Payload URL: `http://YOUR_JENKINS_URL/github-webhook/`
   - Content type: `application/json`
   - Events: Select "Just the push event"
   - Active: ✓

2. **In Jenkins:**
   - Install "GitHub Integration Plugin"
   - In job configuration, under "Build Triggers":
     - Check "GitHub hook trigger for GITScm polling"

3. **Required Jenkins Credentials:**
   - `ec2-host`: EC2 instance public IP
   - `ec2-ssh-key`: SSH private key for EC2 access

## Pipeline Flow:
GitHub Push → Webhook → Jenkins → Docker Build → EC2 Deploy → Live Website